'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  BellIcon as BellIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/24/solid';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useSelector((s) => s.auth);
  const isTeacher = ['teacher', 'incharge', 'staff'].includes(user?.role);
  const homeHref = isTeacher ? '/dashboard/teacher' : '/dashboard/student';

  const navItems = [
    { href: homeHref, label: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid },
    { href: '/timetable', label: 'Timetable', icon: CalendarDaysIcon, activeIcon: CalendarDaysIconSolid },
    { href: '/attendance/my', label: 'Attendance', icon: AcademicCapIcon, activeIcon: AcademicCapIconSolid },
    { href: '/library', label: 'Library', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
    { href: '/notifications', label: 'Alerts', icon: BellIcon, activeIcon: BellIconSolid },
    { href: '/profile', label: 'Profile', icon: UserCircleIcon, activeIcon: UserCircleIconSolid },
  ];

  return (
    <nav className="glass-nav fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Primary portal navigation">
      <div className="mx-auto grid h-[4.25rem] max-w-xl grid-cols-6 px-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && <span className="absolute inset-x-2 top-1.5 h-9 rounded-xl bg-blue-50 ring-1 ring-blue-100" aria-hidden="true" />}
              <Icon className={`relative h-[1.35rem] w-[1.35rem] ${isActive ? 'text-blue-600' : 'text-slate-500'}`} aria-hidden="true" />
              <span className="relative max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
