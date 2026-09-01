'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday' };

export default function MyClassesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  const teacherId = user?.teacher_id;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['teacher-workload', teacherId],
    queryFn: async () => {
      const res = await api.get(`/teacher/${teacherId}/workload`);
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated && !!teacherId,
  });

  if (!isAuthenticated) return null;

  const periods = data?.periods || [];
  const periodsByDay = DAYS.reduce((acc, day) => {
    acc[day] = periods.filter((p) => p.day_of_week === day);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">My Classes</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{data?.total_periods_per_week ?? '—'}</p>
              <p className="text-xs text-gray-500">Periods / Week</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{data?.distinct_classes ?? '—'}</p>
              <p className="text-xs text-gray-500">Classes Taught</p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-16" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
            <p className="text-red-600 text-sm font-medium">Failed to load your classes</p>
            <button onClick={() => refetch()} className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && periods.length === 0 && (
          <div className="bg-white rounded-xl border p-8 text-center">
            <AcademicCapIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No classes assigned yet — check back once your timetable is published.</p>
          </div>
        )}

        {!isLoading && DAYS.map((day) => (
          periodsByDay[day].length > 0 && (
            <section key={day} className="bg-white rounded-xl border overflow-hidden">
              <div className="px-5 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-gray-900">{DAY_LABELS[day]}</h3>
              </div>
              <div className="px-5 pb-4 space-y-2">
                {periodsByDay[day]
                  .sort((a, b) => a.period_number - b.period_number)
                  .map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-teal-700">P{p.period_number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.subject_name || 'Subject'}</p>
                        <p className="text-xs text-gray-500">
                          Class {p.class_name} {p.section_name && `- ${p.section_name}`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{p.start_time?.slice(0, 5)}</span>
                    </div>
                  ))}
              </div>
            </section>
          )
        ))}
      </main>
    </div>
  );
}
