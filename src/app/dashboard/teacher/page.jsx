'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BellIcon,
  UserGroupIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth, logout } from '../../../store/slices/authSlice';
import toast from 'react-hot-toast';

const teacherModules = [
  { name: 'Mark Attendance', href: '/attendance/mark', icon: ClipboardDocumentCheckIcon, color: 'bg-green-100 text-green-700', desc: 'Mark daily student attendance' },
  { name: 'Enter Marks', href: '/exam/marks', icon: AcademicCapIcon, color: 'bg-purple-100 text-purple-700', desc: 'Upload exam & assessment marks' },
  { name: 'Assignments', href: '/assignments', icon: DocumentTextIcon, color: 'bg-orange-100 text-orange-700', desc: 'Create & manage homework' },
  { name: 'My Timetable', href: '/classes', icon: CalendarDaysIcon, color: 'bg-blue-100 text-blue-700', desc: 'Your weekly schedule by day' },
  { name: 'Notifications', href: '/notifications', icon: BellIcon, color: 'bg-red-100 text-red-700', desc: 'Send notices to parents' },
  { name: 'Transport', href: '/transport', icon: TruckIcon, color: 'bg-cyan-100 text-cyan-700', desc: 'View transport routes' },
];

export default function TeacherDashboard() {
  const { user, school, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  const teacherName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Teacher';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {school?.logo_url ? (
              <img src={school.logo_url} alt="" className="h-10 w-10 object-contain rounded" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {school?.name?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{school?.name}</h1>
              <p className="text-xs text-gray-500">Teacher Portal</p>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-600 hidden sm:block">{teacherName}</span>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                {teacherName.charAt(0).toUpperCase()}
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50">
                {/* User info */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{teacherName}</p>
                  <p className="text-xs text-gray-500">{user.email || user.designation || 'Teacher'}</p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircleIcon className="w-4 h-4 text-gray-400" />
                  View Profile
                </Link>
                <Link
                  href="/profile?edit=true"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                  Edit Profile
                </Link>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherModules.map((mod) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition group"
            >
              <div className={`p-3 rounded-lg ${mod.color}`}>
                <mod.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700 transition">{mod.name}</p>
                <p className="text-sm text-gray-500">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
