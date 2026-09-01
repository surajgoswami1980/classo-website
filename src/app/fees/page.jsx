'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, CreditCardIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function FeesPage() {
  const { isAuthenticated, user, school } = useSelector((state) => state.auth);
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null); // invoice_id being paid

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    fetchInvoices();
  }, [isAuthenticated]);

  const fetchInvoices = async () => {
    try {
      // Use user's student_id (or parent can have multiple students)
      const res = await api.get(`/fee/invoice/student/${user.student_id || user.id}`);
      setInvoices(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load fee details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (invoice) => {
    setPaying(invoice.id);
    try {
      // 1. Initiate payment — get Razorpay order
      const res = await api.post('/fee/payment/initiate', {
        invoice_id: invoice.id,
        payment_method: 'upi',
        name: `${user.first_name} ${user.last_name || ''}`,
        email: user.email || '',
        phone: user.phone || '',
      });

      const orderData = res.data.data;

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.razorpay_key,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency,
        name: school?.name || 'School Fee Payment',
        description: `Fee Payment - ${invoice.invoice_number}`,
        image: school?.logo_url || '',
        order_id: orderData.order_id,
        prefill: orderData.prefill,
        theme: { color: school?.primary_color || '#2563EB' },
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            await api.post('/fee/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Invoice marked as paid.');
            fetchInvoices(); // Refresh
          } catch (err) {
            toast.error('Payment verification failed. Contact school admin.');
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(null);
            toast.error('Payment cancelled');
          },
        },
      };

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setPaying(null);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setPaying(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
            <CheckCircleIcon className="h-3.5 w-3.5" /> Paid
          </span>
        );
      case 'overdue':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
            <ExclamationTriangleIcon className="h-3.5 w-3.5" /> Overdue
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full">
            <ClockIcon className="h-3.5 w-3.5" /> Pending
          </span>
        );
      default:
        return <span className="text-xs text-gray-500">{status}</span>;
    }
  };

  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + Number(i.total_amount), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total_amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Fee & Payments</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Pending</p>
            <p className="text-2xl font-bold text-red-600 mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Paid</p>
            <p className="text-2xl font-bold text-green-600 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Invoice List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No fee invoices found</div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{invoice.invoice_number}</p>
                  {getStatusBadge(invoice.status)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {invoice.late_fee > 0 && (
                      <p className="text-xs text-red-500 mt-0.5">+ ₹{invoice.late_fee} late fee</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{Number(invoice.total_amount).toLocaleString('en-IN')}</p>
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => handlePayNow(invoice)}
                        disabled={paying === invoice.id}
                        className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                      >
                        <CreditCardIcon className="h-4 w-4" />
                        {paying === invoice.id ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  );
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
}
