'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ShoppingBagIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve();
    if (document.getElementById('rzp-sdk')) return resolve();
    const s = document.createElement('script');
    s.id = 'rzp-sdk';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = resolve;
    document.body.appendChild(s);
  });
}

export default function StorePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const qc = useQueryClient();
  const { user, school, isAuthenticated } = useSelector((s) => s.auth);
  const [tab, setTab] = useState('shop');
  const [buying, setBuying] = useState(null);

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('erp_token')) router.replace('/login');
  }, [isAuthenticated, router]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['store-items'],
    queryFn: async () => (await api.get('/store/items')).data?.data || [],
    enabled: isAuthenticated,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['store-orders'],
    queryFn: async () => (await api.get('/store/my-orders')).data?.data || [],
    enabled: isAuthenticated && tab === 'orders',
  });

  const buy = async (item) => {
    setBuying(item.id);
    try {
      const res = await api.post('/store/purchase', {
        item_id: item.id, quantity: 1,
        name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
      });
      const order = res.data.data;
      await loadRazorpay();
      const rzp = new window.Razorpay({
        key: order.razorpay_key,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: school?.name || 'School Store',
        description: order.item.name,
        order_id: order.order_id,
        prefill: order.prefill,
        theme: { color: '#2563EB' },
        handler: async (resp) => {
          try {
            await api.post('/store/purchase/verify', {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            toast.success('Purchased! Collect it from the school counter.');
            qc.invalidateQueries({ queryKey: ['store-orders'] });
            qc.invalidateQueries({ queryKey: ['store-items'] });
            setTab('orders');
          } catch { toast.error('Verification failed. Contact school office.'); }
        },
        modal: { ondismiss: () => { setBuying(null); toast('Payment cancelled'); } },
      });
      rzp.on('payment.failed', (r) => toast.error(`Payment failed: ${r.error.description}`));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start purchase');
    } finally { setBuying(null); }
  };

  // The invoice endpoint is auth-protected, so fetch it with the bearer token
  // (via the api instance) as a blob and open it in a new tab for print/save.
  const downloadInvoice = async (o) => {
    try {
      const res = await api.get(`/store/orders/${o.id}/invoice`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/html' }));
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      toast.error('Invoice not available yet.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen aurora-bg pb-20 md:pb-6">
      <StudentHeader title="Store" showBack />
      <main className="max-w-4xl mx-auto px-4 py-4 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setTab('shop')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'shop' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}>Shop</button>
          <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}>My Orders</button>
        </div>

        {tab === 'shop' && (
          isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl border h-56 animate-pulse" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border p-10 text-center text-gray-400">
              <ShoppingBagIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              The store is empty right now. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
                  <div className="h-32 bg-gray-100 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBagIcon className="w-10 h-10 text-gray-300" /></div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                    {item.category && <p className="text-[11px] text-gray-400 capitalize">{item.category}</p>}
                    <p className="text-base font-bold text-blue-600 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                    <button
                      onClick={() => buy(item)}
                      disabled={!item.in_stock || buying === item.id}
                      className="mt-2 w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
                    >
                      {!item.in_stock ? 'Out of stock' : buying === item.id ? 'Processing…' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'orders' && (
          orders.length === 0 ? (
            <div className="bg-white rounded-xl border p-10 text-center text-gray-400">No orders yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-xl border p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {o.image_url ? <img src={o.image_url} className="w-full h-full object-cover" alt="" /> : <ShoppingBagIcon className="w-6 h-6 text-gray-300 m-auto mt-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{o.item_name}</p>
                    <p className="text-xs text-gray-400 font-mono">{o.order_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{Number(o.total_amount).toLocaleString('en-IN')}</p>
                    {o.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full mt-1"><CheckCircleIcon className="w-3 h-3" /> Collected</span>
                    ) : o.status === 'purchased' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-1"><ClockIcon className="w-3 h-3" /> Awaiting Collection</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1 capitalize">{o.status.replace('_',' ')}</span>
                    )}
                    {(o.has_invoice || o.payment_status === 'paid') && (
                      <button
                        onClick={() => downloadInvoice(o)}
                        className="block ml-auto mt-2 text-[11px] font-medium text-blue-600 hover:text-blue-700 underline"
                      >
                        Download Invoice
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
      <BottomNav />
    </div>
  );
}
