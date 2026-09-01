'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }

    const role = user?.role;
    if (role === 'student' || role === 'parent') {
      router.replace('/dashboard/student');
    } else if (role === 'teacher' || role === 'incharge') {
      router.replace('/dashboard/teacher');
    } else {
      // school-admin, sub-admin — show student dashboard as fallback
      router.replace('/dashboard/student');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}
