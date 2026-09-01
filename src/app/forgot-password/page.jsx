'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { BuildingLibraryIcon, ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ school_code: '', identifier: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.school_code.trim() || !formData.identifier.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', {
        school_code: formData.school_code.trim(),
        identifier: formData.identifier.trim(),
      });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {sent ? (
            <div className="text-center">
              <div className="h-14 w-14 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <EnvelopeIcon className="h-7 w-7 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Check your email</h1>
              <p className="text-gray-500 mt-2 text-sm">
                If an account matches those details, we've sent a password reset link to its email address. The link expires in 30 minutes.
              </p>
              <Link href="/login" className="inline-block mt-6 text-sm text-blue-600 font-medium hover:underline">
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="h-12 w-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <BuildingLibraryIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 mt-1 text-sm">Enter your school code and account details to receive a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Code</label>
                  <input
                    type="text"
                    placeholder="e.g., DPSRN01"
                    value={formData.school_code}
                    onChange={(e) => setFormData({ ...formData, school_code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center tracking-widest font-mono"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
                  <input
                    type="text"
                    placeholder="Employee ID, Registration No, Email, or Phone"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">A reset link is only sent if this account has an email on file.</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <Link href="/login" className="flex items-center justify-center gap-1.5 mt-4 text-sm text-gray-500 hover:text-blue-600 transition">
                <ArrowLeftIcon className="h-4 w-4" /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
