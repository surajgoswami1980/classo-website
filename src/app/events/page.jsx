'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(); return; }
    if (document.getElementById('razorpay-script')) { resolve(); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

const CATEGORY_COLORS = {
  sports: 'bg-orange-100 text-orange-700',
  cultural: 'bg-pink-100 text-pink-700',
  academic: 'bg-blue-100 text-blue-700',
  trip: 'bg-teal-100 text-teal-700',
  competition: 'bg-purple-100 text-purple-700',
  general: 'bg-gray-100 text-gray-700',
};

export default function EventsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, school } = useSelector((state) => state.auth);
  const [registering, setRegistering] = useState(null);

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      if (!localStorage.getItem('erp_token')) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/event/list');
      return res.data?.data || [];
    },
    enabled: isAuthenticated,
  });

  const events = data || [];

  const registerFree = async (event) => {
    setRegistering(event.id);
    try {
      const res = await api.post('/event/register', { event_id: event.id });
      const result = res.data?.data;
      if (result?.paid) {
        await payForEvent(event, result);
      } else {
        toast.success('Registered successfully!');
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  const payForEvent = async (event, orderData) => {
    await loadRazorpayScript();
    const options = {
      key: orderData.razorpay_key,
      amount: Math.round(orderData.amount * 100),
      currency: orderData.currency || 'INR',
      name: school?.name || 'Event Registration',
      description: `Event: ${event.title}`,
      order_id: orderData.order_id,
      prefill: orderData.prefill || {},
      theme: { color: '#2563EB' },
      handler: async (response) => {
        try {
          await api.post('/event/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success('Payment successful! You are registered.');
          queryClient.invalidateQueries({ queryKey: ['events'] });
        } catch {
          toast.error('Payment verification failed. Contact the school office.');
        }
      },
      modal: { ondismiss: () => { setRegistering(null); toast('Payment cancelled'); } },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => toast.error(`Payment failed: ${resp.error.description}`));
    rzp.open();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="Events" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {isLoading && (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32" />)}</div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
            <p className="text-red-600 text-sm font-medium">Failed to load events</p>
            <button onClick={() => refetch()} className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Retry</button>
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <CalendarDaysIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No upcoming events right now. Check back soon!</p>
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => {
              const catClass = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.general;
              const full = event.capacity && event.registrations >= event.capacity && !event.is_registered;
              return (
                <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${catClass}`}>{event.category}</span>
                          {event.is_paid
                            ? <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">₹{event.fee}</span>
                            : <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Free</span>}
                        </div>
                        <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                        {event.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>}
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        {event.start_at ? format(new Date(event.start_at), 'EEE, dd MMM yyyy · h:mm a') : '—'}
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          {event.venue}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        {event.registrations} registered{event.capacity ? ` / ${event.capacity}` : ''}
                      </div>
                    </div>

                    <div className="mt-4">
                      {event.is_registered ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                          <CheckCircleIcon className="w-4 h-4" />
                          {event.my_payment_status === 'pending' ? 'Payment pending' : 'Registered'}
                        </span>
                      ) : full ? (
                        <span className="inline-block text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">Event Full</span>
                      ) : (
                        <button
                          onClick={() => registerFree(event)}
                          disabled={registering === event.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                        >
                          <TicketIcon className="w-4 h-4" />
                          {registering === event.id ? 'Processing...' : event.is_paid ? `Register · ₹${event.fee}` : 'Register'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
