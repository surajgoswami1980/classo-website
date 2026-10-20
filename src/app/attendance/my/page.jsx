'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../../store/slices/authSlice';
import api from '../../../services/api';
import StudentHeader from '../../../components/StudentHeader';
import BottomNav from '../../../components/BottomNav';

// Roles that read their own *staff* attendance instead of student attendance.
const STAFF_ROLES = ['teacher', 'incharge', 'staff', 'sub_admin', 'school_admin'];

const METHOD_LABEL = {
  manual: 'Marked by admin',
  app: 'App',
  geo: 'Location',
  face: 'Face',
  face_geo: 'Face + location',
  biometric: 'Fingerprint',
};

const STATUS_DOT = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-amber-400',
  half_day: 'bg-orange-400',
  leave: 'bg-sky-400',
};

const prettyStatus = (s) => (s ? s.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase()) : '');

export default function MyAttendancePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isStaff = STAFF_ROLES.includes(user?.role);

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
  const [selected, setSelected] = useState(null);

  const month = format(currentMonth, 'M');
  const year = format(currentMonth, 'yyyy');

  const { data: attendanceData, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance-monthly', month, year, isStaff],
    queryFn: async () => {
      const url = isStaff
        ? `/attendance/staff/my-monthly?month=${month}&year=${year}`
        : `/attendance/student/monthly?month=${month}&year=${year}`;
      const res = await api.get(url);
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  const { data: upcoming = [] } = useQuery({
    queryKey: ['holidays-upcoming'],
    queryFn: async () => (await api.get('/attendance/holidays/upcoming')).data?.data || [],
    enabled: isAuthenticated,
    retry: false,
  });

  const records = attendanceData?.records || attendanceData?.attendance || [];
  const summary = attendanceData?.summary || {};

  // Lookups by yyyy-MM-dd
  const recordMap = useMemo(() => {
    const m = new Map();
    records.forEach((r) => m.set(r.date || r.attendance_date, r));
    return m;
  }, [records]);

  const offMap = useMemo(() => {
    const m = new Map();
    (attendanceData?.holidays || []).forEach((h) => m.set(h.date, h));
    return m;
  }, [attendanceData]);

  // Server already excludes holidays/weekly offs; fall back only for older APIs.
  const totalDays = summary.total_days ?? records.length;
  const presentDays = summary.present ?? records.filter((r) => r.status === 'present').length;
  const absentDays = summary.absent ?? records.filter((r) => r.status === 'absent').length;
  const lateDays = summary.late ?? records.filter((r) => r.status === 'late').length;
  const holidayCount = summary.holidays ?? 0;
  const percentage =
    summary.percentage ?? (totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0);

  // Calendar (Mon-first)
  const monthStart = startOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: endOfMonth(currentMonth) });
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const selKey = selected ? format(selected, 'yyyy-MM-dd') : null;
  const selRecord = selKey ? recordMap.get(selKey) : null;
  const selOff = selKey ? offMap.get(selKey) : null;

  const changeMonth = (d) => {
    setCurrentMonth(d);
    setSelected(null);
  };

  if (!isAuthenticated) return null;

  const stats = [
    { label: 'Working Days', value: totalDays, box: 'bg-blue-50', num: 'text-blue-700', txt: 'text-blue-600' },
    { label: 'Present', value: presentDays, box: 'bg-green-50', num: 'text-green-600', txt: 'text-green-700' },
    { label: 'Absent', value: absentDays, box: 'bg-red-50', num: 'text-red-500', txt: 'text-red-700' },
    { label: 'Late', value: lateDays, box: 'bg-amber-50', num: 'text-amber-500', txt: 'text-amber-700' },
    { label: 'Holidays', value: holidayCount, box: 'bg-rose-50', num: 'text-rose-600', txt: 'text-rose-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="My Attendance" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-5">
        {/* Summary */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {stats.map((s) => (
              <div key={s.label} className={`text-center p-3 rounded-lg ${s.box}`}>
                <p className={`text-xl font-bold ${s.num}`}>{s.value}</p>
                <p className={`text-xs mt-0.5 ${s.txt}`}>{s.label}</p>
              </div>
            ))}
            <div className="text-center p-3 rounded-lg bg-gray-50">
              <p className={`text-xl font-bold ${percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                {percentage}%
              </p>
              <p className="text-xs text-gray-600 mt-0.5">Percentage</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Attendance (holidays &amp; weekly offs excluded)</span>
              <span className={`text-xs font-medium ${percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                {percentage}%
              </span>
            </div>
            <div
              className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Attendance percentage"
            >
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
            {!isStaff && totalDays > 0 && percentage < 75 && (
              <div className="flex items-center gap-1.5 mt-2 p-2 rounded-lg bg-red-50">
                <ExclamationCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">Your attendance is below 75%. This may affect exam eligibility.</p>
              </div>
            )}
          </div>
        </section>

        {/* Check-in is mobile-only: browser GPS is easy to fake. */}
        {isStaff && (
          <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <DevicePhoneMobileIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-900">
              Daily check-in is done from the mobile app, where location and face checks can be verified.
            </p>
          </div>
        )}

        {/* Calendar */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <button
              onClick={() => changeMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-base font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h3>
            <button
              onClick={() => changeMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="aspect-square flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: paddingDays }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}

                {daysInMonth.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const rec = recordMap.get(key);
                  const off = offMap.get(key);
                  const today = isToday(day);
                  const isSel = selKey === key;
                  const isHoliday = off?.kind === 'holiday';
                  const isWeeklyOff = off?.kind === 'weekly_off';

                  const circle = today
                    ? 'bg-blue-600 text-white'
                    : isHoliday
                    ? 'bg-rose-100 text-rose-700'
                    : isWeeklyOff
                    ? 'text-gray-300'
                    : rec
                    ? 'text-gray-900'
                    : 'text-gray-400';

                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setSelected(isSel ? null : day)}
                      title={off ? off.title : rec ? prettyStatus(rec.status) : undefined}
                      aria-label={`${format(day, 'd MMMM')}${off ? `, ${off.title}` : rec ? `, ${prettyStatus(rec.status)}` : ''}`}
                      className={`aspect-square flex flex-col items-center justify-center relative rounded-lg transition-colors ${
                        isSel ? 'bg-gray-100 ring-1 ring-gray-300' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${circle}`}>
                        {format(day, 'd')}
                      </span>
                      {rec && !off && STATUS_DOT[rec.status] && (
                        <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${STATUS_DOT[rec.status]}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected day details */}
          {selected && (
            <div className="mx-4 mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
              <p className="font-semibold text-gray-900">{format(selected, 'EEEE, d MMMM yyyy')}</p>
              {selOff ? (
                <p className="mt-1 text-rose-700">
                  {selOff.title}
                  {selOff.kind === 'weekly_off' ? ' (weekly off)' : ''}
                </p>
              ) : selRecord ? (
                <div className="mt-1 space-y-0.5 text-gray-700">
                  <p>Status: <span className="font-medium">{prettyStatus(selRecord.status)}</span></p>
                  {selRecord.check_in_time && (
                    <p>
                      In {selRecord.check_in_time?.slice(0, 5)}
                      {selRecord.check_out_time ? ` · Out ${selRecord.check_out_time.slice(0, 5)}` : ''}
                      {selRecord.late_minutes > 0 ? ` · ${selRecord.late_minutes} min late` : ''}
                    </p>
                  )}
                  {selRecord.method && <p>Marked via: {METHOD_LABEL[selRecord.method] || selRecord.method}</p>}
                  {selRecord.remarks && <p className="text-gray-500">{selRecord.remarks}</p>}
                </div>
              ) : (
                <p className="mt-1 text-gray-500">No attendance recorded.</p>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 border-t border-gray-50 bg-gray-50/50">
            {[
              ['bg-green-500', 'Present'],
              ['bg-red-500', 'Absent'],
              ['bg-amber-400', 'Late'],
              ['bg-orange-400', 'Half day'],
              ['bg-sky-400', 'Leave'],
            ].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${c}`} />
                <span className="text-xs text-gray-600">{l}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-100 ring-1 ring-rose-200" />
              <span className="text-xs text-gray-600">Holiday</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-300">00</span>
              <span className="text-xs text-gray-600">Weekly off</span>
            </div>
          </div>
        </section>

        {/* Upcoming holidays */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-semibold text-gray-900">Upcoming Holidays</h3>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming holidays announced.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {upcoming.map((h) => {
                const start = parseISO(h.start_date);
                const end = parseISO(h.end_date);
                const multi = h.end_date && h.end_date !== h.start_date;
                return (
                  <li key={h.id} className="flex items-center gap-3 py-2.5">
                    <div className="w-12 flex-shrink-0 rounded-lg bg-rose-50 py-1 text-center">
                      <p className="text-[10px] font-semibold uppercase text-rose-500">{format(start, 'MMM')}</p>
                      <p className="text-lg font-bold leading-tight text-rose-700">{format(start, 'd')}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{h.title}</p>
                      <p className="text-xs text-gray-500">
                        {multi ? `${format(start, 'EEE d MMM')} – ${format(end, 'EEE d MMM')}` : format(start, 'EEEE')}
                        {h.description ? ` · ${h.description}` : ''}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

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
