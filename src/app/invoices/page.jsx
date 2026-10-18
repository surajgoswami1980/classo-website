'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { ArrowLeftIcon, DocumentArrowDownIcon, CreditCardIcon, TicketIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const SOURCE_META = {
  fee: { label: 'Fees', Icon: CreditCardIcon, tint: 'text-blue-600', bg: 'bg-blue-50' },
  event: { label: 'Events', Icon: TicketIcon, tint: 'text-violet-600', bg: 'bg-violet-50' },
  store: { label: 'Store', Icon: ShoppingBagIcon, tint: 'text-emerald-600', bg: 'bg-emerald-50' },
};

export default function InvoicesPage() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    (async () => {
      try {
        const res = await api.get('/invoices/my');
        setInvoices(res.data.data || []);
      } catch { /* show empty */ } finally { setLoading(false); }
    })();
  }, [isAuthenticated]);

  const filtered = filter === 'all' ? invoices : invoices.filter((i) => i.source === filter);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);
  const totalDue = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + Number(i.amount), 0);

  const openDoc = async (inv) => {
    try {
      // Fetch the HTML with the auth header, then open it as a blob so the
      // printable invoice renders in a new tab.
      const res = await api.get(`/invoices/${inv.source}/${inv.id}/document`, { responseType: 'text' });
      const blob = new Blob([res.data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen aurora-bg">
      <header className="sticky top-0 z-10 glass-nav">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl neu-btn">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">My Invoices</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Summary — neumorphic */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="neu-card rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Paid</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
          </div>
          <div className="neu-card rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">₹{totalDue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {['all', 'fee', 'event', 'store'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === f ? 'neu-pressed text-primary-600' : 'neu-btn text-gray-500'}`}
            >
              {f === 'all' ? 'All' : SOURCE_META[f].label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading invoices…</div>
        ) : filtered.length === 0 ? (
          <div className="neu-card rounded-2xl text-center py-16 text-gray-400">No invoices yet.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv) => {
              const meta = SOURCE_META[inv.source] || SOURCE_META.fee;
              const { Icon } = meta;
              return (
                <div key={`${inv.source}-${inv.id}`} className="neu-card rounded-2xl p-4 flex items-center gap-4">
                  <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${meta.bg}`}>
                    <Icon className={`w-5 h-5 ${meta.tint}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">{inv.title}</p>
                    <p className="text-xs text-gray-400 font-mono">{inv.invoice_number}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} · {inv.meta}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-extrabold text-gray-800">₹{Number(inv.amount).toLocaleString('en-IN')}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {inv.status === 'paid' ? 'Paid' : 'Due'}
                    </span>
                    {inv.status === 'paid' && (
                      <button onClick={() => openDoc(inv)} className="mt-2 flex items-center gap-1 ml-auto text-xs font-semibold text-primary-600">
                        <DocumentArrowDownIcon className="w-4 h-4" /> Invoice
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
