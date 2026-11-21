'use client';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BellIcon,
  Bars3Icon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function StudentHeader({ title, showBack = false, unreadCount = 0 }) {
  const { user, school } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const schoolName = school?.name || school?.school_name || 'MyClasses';
  const schoolLogo = school?.logo || school?.logo_url || null;
  const studentName = user?.name || user?.full_name || 'Student';
  const studentClass = user?.class_name || user?.class || '';
  const studentSection = user?.section_name || user?.section || '';
  const isTeacher = ['teacher', 'incharge', 'staff'].includes(user?.role);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    router.replace('/login');
    toast.success('Logged out successfully');
  };

  const navItems = [
    { href: isTeacher ? '/dashboard/teacher' : '/dashboard/student', label: 'Dashboard' },
    { href: '/timetable', label: 'Timetable' },
    { href: '/attendance/my', label: 'Attendance' },
    { href: '/assignments', label: 'Assignments' },
    { href: '/events', label: 'Events' },
    { href: '/library', label: 'Library' },
    { href: '/transport', label: 'Transport' },
    { href: '/store', label: 'Store' },
    { href: '/fees', label: 'Fees' },
    { href: '/invoices', label: 'My Invoices' },
    { href: '/notifications', label: 'Notifications' },
    { href: '/profile', label: 'View Profile' },
    { href: '/profile?edit=true', label: 'Edit Profile' },
  ];

  return (
    <>
      <header className="glass-nav sticky top-0 z-40 border-b" aria-label="Portal header">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            {showBack ? (
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 md:hidden"
                aria-label="Open portal menu"
                aria-expanded={menuOpen}
                aria-controls="portal-mobile-menu"
              >
                <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}

            <div className="flex min-w-0 items-center gap-3">
              {schoolLogo ? (
                <img src={schoolLogo} alt={`${schoolName} logo`} className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-0.5 shadow-sm" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-md shadow-blue-200" aria-hidden="true">
                  {schoolName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">{title || schoolName}</h1>
                <p className="hidden truncate text-xs text-slate-500 sm:block">{title ? schoolName : studentName}</p>
              </div>
            </div>
          </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Portal shortcuts">
          {navItems.slice(0, 5).map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700">
              {item.label}
            </Link>
          ))}
        </nav>

          <div className="flex shrink-0 items-center gap-2">
            {studentClass && (
              <span className="status-pill status-info hidden sm:inline-flex">
                {studentClass} {studentSection && `• ${studentSection}`}
              </span>
            )}
            <Link
              href="/notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            >
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white" aria-hidden="true">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Portal navigation">
          <button type="button" className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm" onClick={() => setMenuOpen(false)} aria-label="Close portal menu" />
          <aside id="portal-mobile-menu" className="animate-slide-in-left absolute bottom-0 left-0 top-0 flex w-[min(88vw,21rem)] flex-col overflow-hidden bg-white shadow-2xl">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-700 to-navy-900 px-6 pb-6 pt-5 text-white">
              <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
              <div className="relative flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-xl font-bold shadow-inner">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <button type="button" onClick={() => setMenuOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close menu">
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <h2 className="relative mt-4 text-lg font-bold">{studentName}</h2>
              <p className="relative mt-0.5 text-sm text-blue-100">
                {studentClass ? `${studentClass}${studentSection ? ` • ${studentSection}` : ''}` : schoolName}
              </p>
            </div>

            <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-4" aria-label="Portal menu">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-100 bg-white p-4">
              <button type="button" onClick={handleLogout} className="btn-danger w-full justify-start">
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
