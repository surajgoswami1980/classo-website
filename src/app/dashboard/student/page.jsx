'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
  UserCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  BellAlertIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../../store/slices/authSlice';
import api from '../../../services/api';
import StudentHeader from '../../../components/StudentHeader';
import BottomNav from '../../../components/BottomNav';
import BannerSlider from '../../../components/BannerSlider';

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, school, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('erp_token');
      if (!token) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const res = await api.get('/student/dashboard');
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: async () => {
      const res = await api.get('/notification/list?unread=true&limit=5');
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated,
  });

  const studentName = user?.name || user?.full_name || 'Student';
  const className = user?.class_name || user?.class || 'N/A';
  const section = user?.section_name || user?.section || '';
  const rollNumber = user?.roll_number || user?.roll_no || 'N/A';
  const unreadCount = notificationsData?.unread_count || notificationsData?.length || 0;

  const timetable = dashboardData?.today_timetable || [];
  const attendance = dashboardData?.attendance_summary || { present: 85, absent: 10, late: 5 };
  const notifications = notificationsData?.notifications || notificationsData || [];
  const assignments = dashboardData?.upcoming_assignments || [];

  const quickLinks = [
    { href: '/attendance/my', label: 'Attendance', icon: ClipboardDocumentCheckIcon, color: 'bg-green-50 text-green-600' },
    { href: '/exam/results', label: 'Results', icon: AcademicCapIcon, color: 'bg-purple-50 text-purple-600' },
    { href: '/assignments', label: 'Assignments', icon: DocumentTextIcon, color: 'bg-orange-50 text-orange-600' },
    { href: '/timetable', label: 'Timetable', icon: CalendarDaysIcon, color: 'bg-blue-50 text-blue-600' },
    { href: '/fees', label: 'Fees', icon: CurrencyDollarIcon, color: 'bg-amber-50 text-amber-600' },
    { href: '/library', label: 'Library', icon: BookOpenIcon, color: 'bg-teal-50 text-teal-600' },
    { href: '/transport', label: 'Transport', icon: TruckIcon, color: 'bg-cyan-50 text-cyan-600' },
    { href: '/profile', label: 'Profile', icon: UserCircleIcon, color: 'bg-pink-50 text-pink-600' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader unreadCount={unreadCount} />

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-5">
        {/* Banner carousel + popup */}
        <BannerSlider />

        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Welcome back 👋</p>
              <h2 className="text-xl font-bold mt-1">{studentName}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  Class {className}
                </span>
                {section && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                    Sec {section}
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  Roll #{rollNumber}
                </span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold">{studentName.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
            <p className="text-red-600 text-sm font-medium">Failed to load dashboard data</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Today's Timetable */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-blue-600" />
                  Today&apos;s Timetable
                </h3>
                <Link href="/timetable" className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="px-5 pb-4">
                {timetable.length > 0 ? (
                  <div className="space-y-2">
                    {timetable.slice(0, 4).map((period, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-700">P{idx + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {period.subject_name || period.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {period.teacher_name || period.teacher} • {period.room || 'Room N/A'}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {period.start_time || period.time}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No classes scheduled today 🎉
                  </p>
                )}
              </div>
            </section>

            {/* Attendance Summary */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-600" />
                  Attendance This Month
                </h3>
                <Link href="/attendance/my" className="text-xs text-blue-600 font-medium hover:underline">
                  Details
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <p className="text-2xl font-bold text-green-600">{attendance.present || 0}%</p>
                  <p className="text-xs text-green-700 mt-0.5">Present</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50">
                  <p className="text-2xl font-bold text-red-500">{attendance.absent || 0}%</p>
                  <p className="text-xs text-red-700 mt-0.5">Absent</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50">
                  <p className="text-2xl font-bold text-amber-500">{attendance.late || 0}%</p>
                  <p className="text-xs text-amber-700 mt-0.5">Late</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (attendance.present || 0) >= 75 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${attendance.present || 0}%` }}
                  />
                </div>
                {(attendance.present || 0) < 75 && (
                  <p className="text-xs text-red-500 mt-1">⚠️ Attendance below 75% — Needs improvement</p>
                )}
              </div>
            </section>

            {/* Quick Access Grid */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Quick Access</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color}`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Upcoming Assignments */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-orange-600" />
                  Upcoming Assignments
                </h3>
                <Link href="/assignments" className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="px-5 pb-4">
                {assignments.length > 0 ? (
                  <div className="space-y-2">
                    {assignments.slice(0, 3).map((assignment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {assignment.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {assignment.subject_name || assignment.subject}
                          </p>
                        </div>
                        <span className="text-xs text-orange-600 font-medium whitespace-nowrap ml-3">
                          Due {assignment.due_date ? format(new Date(assignment.due_date), 'MMM dd') : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No upcoming assignments 📝
                  </p>
                )}
              </div>
            </section>

            {/* Recent Notifications */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <BellAlertIcon className="w-4 h-4 text-purple-600" />
                  Recent Notifications
                </h3>
                <Link href="/notifications" className="text-xs text-blue-600 font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="px-5 pb-4">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.slice(0, 4).map((notif, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                      >
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                          notif.is_read ? 'bg-gray-300' : 'bg-blue-500'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">{notif.message || notif.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No notifications yet 🔔
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
