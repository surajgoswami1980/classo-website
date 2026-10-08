'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { BuildingLibraryIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, DevicePhoneMobileIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Steps: 1 = school lookup | 2 = credentials | 3 = OTP entry
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState(null);

  // auth mode: 'password' | 'otp'
  const [mode, setMode] = useState('password');
  const [otpConfig, setOtpConfig] = useState({ otp_login_enabled: false, channels: [] });
  const [otpChannel, setOtpChannel] = useState('email');
  const [otpMeta, setOtpMeta] = useState(null); // { masked, cooldown }
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    school_code: '',
    identifier: '',
    password: '',
  });

  const routeByRole = (user) => {
    if (user.role === 'student' || user.role === 'parent') router.push('/dashboard/student');
    else if (user.role === 'teacher' || user.role === 'incharge') router.push('/dashboard/teacher');
    else router.push('/dashboard');
  };

  const handleSchoolLookup = async (e) => {
    e.preventDefault();
    if (!formData.school_code.trim()) {
      toast.error('Please enter school code');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/lookup-school', { school_code: formData.school_code.trim() });
      setSchoolInfo(res.data.data);

      // Ask the API whether this school allows OTP login
      try {
        const otpRes = await api.post('/auth/otp/availability', { school_code: formData.school_code.trim() });
        const cfg = otpRes.data.data || { otp_login_enabled: false, channels: [] };
        setOtpConfig(cfg);
        if (cfg.channels?.length) setOtpChannel(cfg.channels[0]);
      } catch {
        setOtpConfig({ otp_login_enabled: false, channels: [] });
      }

      setMode('password');
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
      routeByRole(user);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!formData.identifier.trim()) {
      toast.error('Enter your registered email or mobile');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/request', {
        school_code: formData.school_code.trim(),
        identifier: formData.identifier.trim(),
        channel: otpChannel,
      });
      const data = res.data.data || {};
      setOtpMeta(data);
      setOtp('');
      setStep(3);
      if (data.dev_otp) toast.success(`Dev OTP: ${data.dev_otp}`, { duration: 8000 });
      else toast.success(`OTP sent to ${data.masked || 'your ' + otpChannel}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Enter the OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/verify', {
        school_code: formData.school_code.trim(),
        identifier: formData.identifier.trim(),
        otp: otp.trim(),
      });
      const { access_token, refresh_token, user, school } = res.data.data;
      dispatch(setCredentials({ user, school, access_token, refresh_token }));
      toast.success(`Welcome, ${user.name}!`);
      routeByRole(user);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetToSchool = () => {
    setStep(1); setSchoolInfo(null); setMode('password'); setOtp(''); setOtpMeta(null);
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

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* ─── STEP 1: School code ─────────────────────────────── */}
          {step === 1 && (
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
          )}

          {/* ─── STEP 2: Credentials (password or OTP request) ───── */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">Sign In</h1>
                <p className="text-gray-500 mt-1 text-sm">
                  {mode === 'password' ? 'Use your ID, Email, or Phone' : 'We\u2019ll send a one-time password'}
                </p>
              </div>

              {/* Mode toggle (only if school enables OTP) */}
              {otpConfig.otp_login_enabled && (
                <div className="flex p-1 mb-5 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMode('password')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${mode === 'password' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('otp')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${mode === 'otp' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    OTP
                  </button>
                </div>
              )}

              {mode === 'password' ? (
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
              ) : (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Registered email or mobile number"
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Channel selector (only channels the school enabled) */}
                  {otpConfig.channels?.length > 1 && (
                    <div className="flex gap-2">
                      {otpConfig.channels.includes('email') && (
                        <button
                          type="button"
                          onClick={() => setOtpChannel('email')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border transition ${otpChannel === 'email' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'}`}
                        >
                          <EnvelopeIcon className="h-4 w-4" /> Email
                        </button>
                      )}
                      {otpConfig.channels.includes('mobile') && (
                        <button
                          type="button"
                          onClick={() => setOtpChannel('mobile')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border transition ${otpChannel === 'mobile' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'}`}
                        >
                          <DevicePhoneMobileIcon className="h-4 w-4" /> Mobile
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-white rounded-xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: schoolInfo?.primary_color || '#2563EB' }}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              )}

              <button
                onClick={resetToSchool}
                className="w-full mt-3 text-sm text-gray-500 hover:text-blue-600 transition"
              >
                ← Change School
              </button>
            </>
          )}

          {/* ─── STEP 3: OTP entry ───────────────────────────────── */}
          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <div className="h-12 w-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <KeyIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Enter OTP</h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Sent to <span className="font-medium text-gray-700">{otpMeta?.masked || 'your ' + otpChannel}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="______"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-2xl tracking-[0.5em] font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white rounded-xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: schoolInfo?.primary_color || '#2563EB' }}
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </form>

              <div className="flex items-center justify-between mt-4 text-sm">
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-blue-600 transition">
                  ← Back
                </button>
                <button onClick={handleRequestOtp} disabled={loading} className="text-blue-600 hover:underline disabled:opacity-50">
                  Resend OTP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
