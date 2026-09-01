'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { BuildingLibraryIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Step 1: School lookup | Step 2: Credentials
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [formData, setFormData] = useState({
    school_code: '',
    identifier: '',
    password: '',
  });

  const handleSchoolLookup = async (e) => {
    e.preventDefault();
    if (!formData.school_code.trim()) {
      toast.error('Please enter school code');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/lookup-school', {
        school_code: formData.school_code.trim(),
      });
      setSchoolInfo(res.data.data);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'School not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        school_code: formData.school_code.trim(),
        identifier: formData.identifier.trim(),
        password: formData.password,
      });
      const { access_token, refresh_token, user, school } = res.data.data;
      dispatch(setCredentials({ user, school, access_token, refresh_token }));
      toast.success(`Welcome, ${user.name}!`);

      // Route based on role
      if (user.role === 'student' || user.role === 'parent') {
        router.push('/dashboard/student');
      } else if (user.role === 'teacher' || user.role === 'incharge') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* School branding */}
        {schoolInfo && (
          <div className="text-center mb-6">
            {schoolInfo.logo_url ? (
              <img src={schoolInfo.logo_url} alt={schoolInfo.name} className="h-16 mx-auto mb-2 object-contain" />
            ) : (
              <div
                className="h-16 w-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: schoolInfo.primary_color || '#2563EB' }}
              >
                {schoolInfo.name?.[0]}
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-800">{schoolInfo.name}</h2>
            <p className="text-sm text-gray-500">{schoolInfo.board_affiliation}</p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {step === 1 ? (
            <>
              <div className="text-center mb-6">
                <div className="h-12 w-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <BuildingLibraryIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">School ERP</h1>
                <p className="text-gray-500 mt-1">Enter your school code to continue</p>
              </div>

              <form onSubmit={handleSchoolLookup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Code</label>
                  <input
                    type="text"
                    placeholder="e.g., DPSRN01"
                    value={formData.school_code}
                    onChange={(e) => setFormData({ ...formData, school_code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-lg tracking-widest font-mono"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Ask your school administrator for the code</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Finding School...' : 'Continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">Sign In</h1>
                <p className="text-gray-500 mt-1 text-sm">Use your Employee ID, Registration ID, or Email</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID / Email / Phone</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Employee ID, Registration No, Email"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white rounded-xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: schoolInfo?.primary_color || '#2563EB' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <button
                onClick={() => { setStep(1); setSchoolInfo(null); }}
                className="w-full mt-3 text-sm text-gray-500 hover:text-blue-600 transition"
              >
                ← Change School
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
