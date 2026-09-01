'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      // Redirect based on role
      const role = user?.role;
      if (role === 'student' || role === 'parent') {
        router.replace('/dashboard/student');
      } else if (role === 'teacher' || role === 'incharge') {
        router.replace('/dashboard/teacher');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  );
}
