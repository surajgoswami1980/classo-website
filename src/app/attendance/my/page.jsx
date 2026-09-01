'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
} from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../../store/slices/authSlice';
import api from '../../../services/api';
import StudentHeader from '../../../components/StudentHeader';
import BottomNav from '../../../components/BottomNav';

export default function MyAttendancePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('erp_token');
      if (!token) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const month = format(currentMonth, 'M');
  const year = format(currentMonth, 'yyyy');

  const { data: attendanceData, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance-monthly', month, year],
    queryFn: async () => {
      const res = await api.get(`/attendance/student/monthly?month=${month}&year=${year}`);
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  const records = attendanceData?.records || attendanceData?.attendance || [];
  const summary = attendanceData?.summary || {};

  // Calculate stats
  const totalDays = summary.total_days || records.length || 0;
  const presentDays = summary.present || records.filter((r) => r.status === 'present').length || 0;
  const absentDays = summary.absent || records.filter((r) => r.status === 'absent').length || 0;
  const lateDays = summary.late || records.filter((r) => r.status === 'late').length || 0;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Calendar generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0=Sun, 1=Mon...
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Adjust for Mon start

  const getStatusForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = records.find((r) => r.date === dateStr || r.attendance_date === dateStr);
    return record?.status || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'late':
        return 'bg-amber-400';
      case 'holiday':
        return 'bg-gray-300';
      default:
        return '';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="My Attendance" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-5">
        {/* Summary Stats */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <p className="text-xl font-bold text-blue-700">{totalDays}</p>
              <p className="text-xs text-blue-600 mt-0.5">Total Days</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50">
              <p className="text-xl font-bold text-green-600">{presentDays}</p>
              <p className="text-xs text-green-700 mt-0.5">Present</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50">
              <p className="text-xl font-bold text-red-500">{absentDays}</p>
              <p className="text-xs text-red-700 mt-0.5">Absent</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50">
              <p className="text-xl font-bold text-amber-500">{lateDays}</p>
              <p className="text-xs text-amber-700 mt-0.5">Late</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 col-span-2 sm:col-span-1">
              <p className={`text-xl font-bold ${percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                {percentage}%
              </p>
              <p className="text-xs text-gray-600 mt-0.5">Percentage</p>
            </div>
          </div>

          {/* Percentage Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Overall Attendance</span>
              <span className={`text-xs font-medium ${percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                {percentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  percentage >= 90
                    ? 'bg-green-500'
                    : percentage >= 75
                    ? 'bg-green-400'
                    : percentage >= 60
                    ? 'bg-amber-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {percentage < 75 && (
              <div className="flex items-center gap-1.5 mt-2 p-2 rounded-lg bg-red-50">
                <ExclamationCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">
                  Your attendance is below 75%. This may affect exam eligibility.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Month Selector + Calendar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-base font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="aspect-square flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {/* Calendar Days */}
            {!isLoading && (
              <div className="grid grid-cols-7 gap-1">
                {/* Padding for days before month starts */}
                {Array.from({ length: paddingDays }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}

                {/* Actual days */}
                {daysInMonth.map((day) => {
                  const status = getStatusForDate(day);
                  const today = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className="aspect-square flex flex-col items-center justify-center relative"
                    >
                      <span
                        className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${
                          today
                            ? 'bg-blue-600 text-white'
                            : status === 'present'
                            ? 'text-gray-900'
                            : status === 'absent'
                            ? 'text-gray-900'
                            : status === 'late'
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      {status && (
                        <span
                          className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 py-3 border-t border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-xs text-gray-600">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-600">Late</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <p className="text-red-600 text-sm">Failed to load attendance data</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
