'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format, getDay } from 'date-fns';
import {
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Mock data for fallback
const MOCK_TIMETABLE = {
  Monday: [
    { subject: 'Mathematics', teacher: 'Mr. Sharma', start_time: '08:00', end_time: '08:45', room: 'Room 101' },
    { subject: 'English', teacher: 'Ms. Gupta', start_time: '08:50', end_time: '09:35', room: 'Room 102' },
    { subject: 'Science', teacher: 'Mr. Verma', start_time: '09:40', end_time: '10:25', room: 'Lab 1' },
    { subject: 'Break', teacher: '', start_time: '10:25', end_time: '10:45', room: '' },
    { subject: 'Hindi', teacher: 'Mrs. Singh', start_time: '10:45', end_time: '11:30', room: 'Room 101' },
    { subject: 'Social Studies', teacher: 'Mr. Patel', start_time: '11:35', end_time: '12:20', room: 'Room 103' },
  ],
  Tuesday: [
    { subject: 'Science', teacher: 'Mr. Verma', start_time: '08:00', end_time: '08:45', room: 'Lab 1' },
    { subject: 'Mathematics', teacher: 'Mr. Sharma', start_time: '08:50', end_time: '09:35', room: 'Room 101' },
    { subject: 'English', teacher: 'Ms. Gupta', start_time: '09:40', end_time: '10:25', room: 'Room 102' },
    { subject: 'Break', teacher: '', start_time: '10:25', end_time: '10:45', room: '' },
    { subject: 'Computer', teacher: 'Mr. Joshi', start_time: '10:45', end_time: '11:30', room: 'Computer Lab' },
    { subject: 'Physical Education', teacher: 'Mr. Kumar', start_time: '11:35', end_time: '12:20', room: 'Ground' },
  ],
  Wednesday: [
    { subject: 'Hindi', teacher: 'Mrs. Singh', start_time: '08:00', end_time: '08:45', room: 'Room 101' },
    { subject: 'Mathematics', teacher: 'Mr. Sharma', start_time: '08:50', end_time: '09:35', room: 'Room 101' },
    { subject: 'Science', teacher: 'Mr. Verma', start_time: '09:40', end_time: '10:25', room: 'Lab 1' },
    { subject: 'Break', teacher: '', start_time: '10:25', end_time: '10:45', room: '' },
    { subject: 'English', teacher: 'Ms. Gupta', start_time: '10:45', end_time: '11:30', room: 'Room 102' },
    { subject: 'Art', teacher: 'Ms. Mehta', start_time: '11:35', end_time: '12:20', room: 'Art Room' },
  ],
  Thursday: [
    { subject: 'English', teacher: 'Ms. Gupta', start_time: '08:00', end_time: '08:45', room: 'Room 102' },
    { subject: 'Science', teacher: 'Mr. Verma', start_time: '08:50', end_time: '09:35', room: 'Lab 1' },
    { subject: 'Mathematics', teacher: 'Mr. Sharma', start_time: '09:40', end_time: '10:25', room: 'Room 101' },
    { subject: 'Break', teacher: '', start_time: '10:25', end_time: '10:45', room: '' },
    { subject: 'Social Studies', teacher: 'Mr. Patel', start_time: '10:45', end_time: '11:30', room: 'Room 103' },
    { subject: 'Hindi', teacher: 'Mrs. Singh', start_time: '11:35', end_time: '12:20', room: 'Room 101' },
  ],
  Friday: [
    { subject: 'Mathematics', teacher: 'Mr. Sharma', start_time: '08:00', end_time: '08:45', room: 'Room 101' },
    { subject: 'Computer', teacher: 'Mr. Joshi', start_time: '08:50', end_time: '09:35', room: 'Computer Lab' },
    { subject: 'English', teacher: 'Ms. Gupta', start_time: '09:40', end_time: '10:25', room: 'Room 102' },
    { subject: 'Break', teacher: '', start_time: '10:25', end_time: '10:45', room: '' },
    { subject: 'Science', teacher: 'Mr. Verma', start_time: '10:45', end_time: '11:30', room: 'Lab 1' },
    { subject: 'Music', teacher: 'Mrs. Kapoor', start_time: '11:35', end_time: '12:20', room: 'Music Room' },
  ],
  Saturday: [
    { subject: 'Physical Education', teacher: 'Mr. Kumar', start_time: '08:00', end_time: '08:45', room: 'Ground' },
    { subject: 'Mathematics', teacher: 'Mr. Sharma', start_time: '08:50', end_time: '09:35', room: 'Room 101' },
    { subject: 'Science', teacher: 'Mr. Verma', start_time: '09:40', end_time: '10:25', room: 'Lab 1' },
  ],
};

export default function TimetablePage() {
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

  // Get today's day index (0=Mon for our array; JS getDay: 0=Sun,1=Mon...6=Sat)
  const todayIdx = (() => {
    const d = getDay(new Date());
    return d === 0 ? 5 : d - 1; // If Sunday, default to Saturday
  })();

  const [selectedDay, setSelectedDay] = useState(todayIdx);

  const { data: timetableData, isLoading, error } = useQuery({
    queryKey: ['weekly-timetable'],
    queryFn: async () => {
      const res = await api.get('/timetable/week');
      const periods = res.data?.data || res.data || [];
      // API returns a flat array of periods; group by day for lookup below.
      return periods.reduce((byDay, p) => {
        const day = p.day_of_week;
        (byDay[day] = byDay[day] || []).push(p);
        return byDay;
      }, {});
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  // Use API data or fallback to mock
  const weeklyData = timetableData || MOCK_TIMETABLE;
  const selectedDayName = DAY_FULL[selectedDay];
  const periods = weeklyData[selectedDayName] || weeklyData[DAYS[selectedDay]] || [];

  const subjectColors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-pink-100 text-pink-700 border-pink-200',
    'bg-teal-100 text-teal-700 border-teal-200',
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-amber-100 text-amber-700 border-amber-200',
  ];

  const getColorForSubject = (subject, idx) => {
    if (subject?.toLowerCase() === 'break') return 'bg-gray-100 text-gray-500 border-gray-200';
    return subjectColors[idx % subjectColors.length];
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="Timetable" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Day Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {DAYS.map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedDay === idx
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : idx === todayIdx
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
              }`}
            >
              {day}
              {idx === todayIdx && selectedDay !== idx && (
                <span className="ml-1 w-1.5 h-1.5 inline-block bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Day Title */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-lg font-semibold text-gray-900">{selectedDayName}</h2>
          <span className="text-xs text-gray-500">
            {periods.length} {periods.length === 1 ? 'period' : 'periods'}
          </span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Period Cards */}
        {!isLoading && periods.length > 0 && (
          <div className="space-y-3">
            {periods.map((period, idx) => {
              const isBreak = period.subject?.toLowerCase() === 'break' || period.subject_name?.toLowerCase() === 'break';
              const colorClass = getColorForSubject(period.subject || period.subject_name, idx);

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
                    isBreak ? 'border-dashed border-gray-300' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Period Number */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass}`}>
                      <span className="text-sm font-bold">
                        {isBreak ? '☕' : `P${idx + 1}`}
                      </span>
                    </div>

                    {/* Period Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold ${isBreak ? 'text-gray-500' : 'text-gray-900'}`}>
                        {period.subject_name || period.subject}
                      </h4>
                      {!isBreak && (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <UserIcon className="w-3.5 h-3.5" />
                            {period.teacher_name || period.teacher}
                          </span>
                          {(period.room) && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPinIcon className="w-3.5 h-3.5" />
                              {period.room}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Time */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>{period.start_time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        to {period.end_time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && periods.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <CalendarDaysIcon className="w-10 h-10 text-blue-300" />
            </div>
            <h3 className="text-gray-700 font-medium">No Classes Scheduled</h3>
            <p className="text-gray-400 text-sm mt-1">
              Enjoy your day off! 🎉
            </p>
          </div>
        )}

        {/* Error fallback note */}
        {error && !isLoading && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Showing sample timetable. Connect to the internet for live data.
          </p>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
