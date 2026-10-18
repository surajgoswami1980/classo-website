'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import LandingPage from '../components/landing/LandingPage';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const role = user?.role;
      if (role === 'student' || role === 'parent') {
        router.replace('/dashboard/student');
      } else if (role === 'teacher' || role === 'incharge') {
        router.replace('/dashboard/teacher');
      } else {
        router.replace('/dashboard');
      }
    } else {
      // Guest → show the marketing site.
      setChecked(true);
    }
  }, [isAuthenticated, user]);

  // While redirecting an authenticated user, show a lightweight spinner.
  if (isAuthenticated && !checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return <LandingPage />;
}
