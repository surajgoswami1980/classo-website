'use client';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BellIcon,
  Bars3Icon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function StudentHeader({ title, showBack = false, unreadCount = 0 }) {
  const { user, school } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const schoolName = school?.name || school?.school_name || 'School ERP';
  const schoolLogo = school?.logo || null;
  const studentName = user?.name || user?.full_name || 'Student';
  const studentClass = user?.class_name || user?.class || '';
  const studentSection = user?.section_name || user?.section || '';

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    router.replace('/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left section */}
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                onClick={() => router.back()}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
              </button>
            ) : (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              >
                <Bars3Icon className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* School logo & name */}
            <div className="flex items-center gap-2">
              {schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt={schoolName}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {schoolName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-gray-900 leading-tight">
                  {title || schoolName}
                </h1>
                {!title && (
                  <p className="text-xs text-gray-500">{studentName}</p>
                )}
              </div>
              {title && (
                <h1 className="sm:hidden text-sm font-semibold text-gray-900">
                  {title}
                </h1>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {studentClass && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {studentClass} {studentSection && `- ${studentSection}`}
              </span>
            )}
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BellIcon className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile slide menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in-left">
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <span className="text-white text-xl font-bold">
                  {studentName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg">{studentName}</h3>
              <p className="text-blue-100 text-sm">
                {studentClass} {studentSection && `| ${studentSection}`}
              </p>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { href: '/dashboard/student', label: 'Dashboard' },
                { href: '/timetable', label: 'Timetable' },
                { href: '/attendance/my', label: 'Attendance' },
                { href: '/assignments', label: 'Assignments' },
                { href: '/events', label: 'Events' },
                { href: '/library', label: 'Library' },
                { href: '/transport', label: 'Transport' },
                { href: '/fees', label: 'Fees' },
                { href: '/notifications', label: 'Notifications' },
                { href: '/profile', label: 'View Profile' },
                { href: '/profile?edit=true', label: 'Edit Profile' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* Logout in side menu */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
