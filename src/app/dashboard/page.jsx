'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }

    // Wait until the user (and its role) is actually hydrated. Deciding while
    // role is still undefined is what caused teachers to bounce onto the
    // student dashboard right after navigating.
    const role = user?.role;
    if (!role) return;

    if (role === 'teacher' || role === 'incharge') {
      router.replace('/dashboard/teacher');
    } else {
      router.replace('/dashboard/student');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}
