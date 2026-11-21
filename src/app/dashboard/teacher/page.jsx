'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  TruckIcon,
  BookOpenIcon,
  TicketIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth, logout } from '../../../store/slices/authSlice';
import api from '../../../services/api';
import toast from 'react-hot-toast';

// Full parity with the app teacher's quick actions.
const teacherModules = [
  { name: 'Mark Attendance', href: '/attendance/mark', icon: ClipboardDocumentCheckIcon, color: 'from-green-400 to-emerald-500', desc: 'Mark daily student attendance' },
  { name: 'Enter Marks', href: '/exam/marks', icon: AcademicCapIcon, color: 'from-purple-400 to-violet-500', desc: 'Upload exam & assessment marks' },
  { name: 'Assignments', href: '/assignments', icon: DocumentTextIcon, color: 'from-orange-400 to-amber-500', desc: 'Create & manage homework' },
  { name: 'My Classes', href: '/classes', icon: CalendarDaysIcon, color: 'from-blue-400 to-indigo-500', desc: 'Your weekly schedule by day' },
  { name: 'My Attendance', href: '/attendance/my', icon: CheckCircleIcon, color: 'from-teal-400 to-cyan-500', desc: 'Your monthly attendance' },
  { name: 'Events', href: '/events', icon: TicketIcon, color: 'from-pink-400 to-rose-500', desc: 'School events & registrations' },
  { name: 'Library', href: '/library', icon: BookOpenIcon, color: 'from-cyan-400 to-sky-500', desc: 'Browse & track library books' },
  { name: 'Transport', href: '/transport', icon: TruckIcon, color: 'from-amber-400 to-yellow-500', desc: 'View transport routes' },
  { name: 'Notifications', href: '/notifications', icon: BellIcon, color: 'from-red-400 to-rose-500', desc: 'Notices & alerts' },
];

export default function TeacherDashboard() {
  const { user, school, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => { if (!isAuthenticated) router.replace('/login'); }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const now = new Date();
  const { data: att } = useQuery({
    queryKey: ['teacher-attendance', now.getMonth() + 1, now.getFullYear()],
    queryFn: async () => {
      const res = await api.get(`/attendance/staff/my-monthly?month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  const teacherName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Teacher';
  const summary = att?.summary || { total_days: 0, present: 0, absent: 0, late: 0 };
  const pct = summary.total_days > 0 ? Math.round((summary.present / summary.total_days) * 100) : 0;

  const stats = [
    { label: 'Present', value: summary.present || 0, accent: 'text-emerald-600' },
    { label: 'Absent', value: summary.absent || 0, accent: 'text-red-600' },
    { label: 'Late', value: summary.late || 0, accent: 'text-amber-600' },
    { label: 'Rate', value: `${pct}%`, accent: 'text-blue-600' },
  ];

  return (
    <div className="portal-shell min-h-screen">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {school?.logo_url ? (
              <img src={school.logo_url} alt={`${school?.name || 'School'} logo`} className="h-10 w-10 object-contain rounded-xl" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                {school?.name?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{school?.name}</h1>
              <p className="text-xs text-gray-500">Teacher Portal</p>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Open account menu"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-blue-50"
            >
              <span className="text-sm text-gray-600 hidden sm:block">{teacherName}</span>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-medium text-white shadow">
                {teacherName.charAt(0).toUpperCase()}
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-elevated animate-portal-enter">
                <div className="px-4 py-2 border-b border-white/40">
                  <p className="text-sm font-medium text-gray-900">{teacherName}</p>
                  <p className="text-xs text-gray-500">{user.email || user.designation || 'Teacher'}</p>
                </div>
                <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 transition-colors">
                  <UserCircleIcon className="w-4 h-4 text-gray-400" /> View Profile
                </Link>
                <Link href="/profile?edit=true" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 transition-colors">
                  <PencilSquareIcon className="w-4 h-4 text-gray-400" /> Edit Profile
                </Link>
                <div className="border-t border-white/40 mt-1 pt-1">
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/70 transition-colors">
                    <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="portal-container space-y-8 py-6 sm:py-9">
        {/* Welcome + attendance summary */}
        <section className="portal-hero animate-portal-enter p-6 sm:p-8">
          <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-blue-100">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_0_4px_rgba(103,232,249,0.14)]" aria-hidden="true" />
                Teacher workspace
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Good to see you, {teacherName}</h2>
              <p className="mt-2 text-sm text-blue-100">{user.designation || 'Teacher'}{user.department ? ` · ${user.department}` : ''}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {stats.map((s) => (
                <div key={s.label} className="teacher-stat">
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-100">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-white transition-[width] duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-blue-100">Your attendance this month</p>
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Workspace</p>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Quick actions</h3>
            </div>
            <p className="hidden text-sm text-slate-500 sm:block">Manage your day from one place</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherModules.map((mod) => (
              <Link
                key={mod.name}
                href={mod.href}
                className="surface-card surface-card-interactive group flex items-center gap-4 p-5"
              >
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${mod.color} text-white shadow-lg`}>
                  <mod.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition">{mod.name}</p>
                  <p className="text-sm text-gray-500">{mod.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
