'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { TruckIcon, MapPinIcon, ClockIcon, PhoneIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

export default function TransportPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher' || user?.role === 'incharge';

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['transport', isTeacher],
    queryFn: async () => {
      const res = await api.get(isTeacher ? '/transport/route/list' : '/transport/my');
      return res.data?.data;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  return (
    <div className={`min-h-screen bg-gray-50 ${isTeacher ? '' : 'pb-20 md:pb-6'}`}>
      {isTeacher ? (
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Transport Routes</h1>
          </div>
        </header>
      ) : (
        <StudentHeader title="Transport" showBack />
      )}

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-5">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24" />)}
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
            <p className="text-red-600 text-sm font-medium">Failed to load transport info</p>
            <button onClick={() => refetch()} className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Student/Parent: their own assignment */}
        {!isLoading && !isTeacher && (
          data ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <TruckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-teal-100 text-xs">Your Route</p>
                    <h2 className="text-lg font-bold">{data.route_name}</h2>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{data.stop_name}</p>
                    <p className="text-xs text-gray-500">Your pickup/drop stop</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm font-medium text-gray-900">{data.pickup_time?.slice(0, 5) || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Drop</p>
                      <p className="text-sm font-medium text-gray-900">{data.drop_time?.slice(0, 5) || '—'}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Driver</p>
                      <p className="text-sm font-medium text-gray-900">{data.driver_name || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm font-medium text-gray-900">{data.driver_phone || '—'}</p>
                    </div>
                  </div>
                </div>
                {(data.conductor_name || data.conductor_phone) && (
                  <div className="border-t pt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Conductor</p>
                        <p className="text-sm font-medium text-gray-900">{data.conductor_name || 'Not assigned'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm font-medium text-gray-900">{data.conductor_phone || '—'}</p>
                      </div>
                    </div>
                  </div>
                )}
                {data.vehicle_number && (
                  <div className="border-t pt-4 flex items-center gap-2">
                    <TruckIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="text-sm font-medium text-gray-900">{data.vehicle_number} ({data.vehicle_type})</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
              <TruckIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">You're not assigned to a transport route yet. Contact your school office if you need one.</p>
            </div>
          )
        )}

        {/* Teacher: list of all routes */}
        {!isLoading && isTeacher && (
          Array.isArray(data) && data.length > 0 ? (
            <div className="space-y-3">
              {data.map((route) => (
                <div key={route.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <TruckIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{route.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {route.vehicle_number ? `${route.vehicle_number} · cap. ${route.capacity}` : 'No vehicle assigned'}
                    </p>
                    <p className="text-xs text-gray-500">{route.driver_name || 'No driver assigned'} {route.driver_phone && `· ${route.driver_phone}`}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{route.stop_count} stops</span>
                      <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">{route.student_count} students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
              <TruckIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No transport routes configured yet.</p>
            </div>
          )
        )}
      </main>

      {!isTeacher && <BottomNav />}
    </div>
  );
}
