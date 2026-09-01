'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon,
  IdentificationIcon,
  UsersIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth, logout, setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, school, token, refreshToken, isAuthenticated } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('erp_token');
      if (!storedToken) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Check if edit mode was requested via URL param
  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
  }, [searchParams]);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  // Initialize edit form when profile loads
  useEffect(() => {
    if (profileData) {
      setEditForm({
        name: profileData.name || '',
        phone: profileData.phone || '',
      });
    }
  }, [profileData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/auth/update-profile', data);
      return res.data?.data || res.data;
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setIsEditing(false);

      // Update local user data in Redux
      const updatedUser = { ...user, name: data.name, phone: data.phone, avatar: data.avatar };
      dispatch(setCredentials({
        user: updatedUser,
        school,
        access_token: token,
        refresh_token: refreshToken,
      }));
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    updateProfileMutation.mutate({
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
    });
  };

  const profile = profileData || user || {};
  const displayName = profile.name || profile.full_name || 'User';
  const role = profile.role || user?.role || 'student';
  const className = profile.class_name || user?.class_name || '';
  const section = profile.section_name || user?.section_name || '';
  const rollNumber = profile.roll_number || user?.roll_number || '';
  const admissionNumber = profile.admission_number || user?.admission_number || '';
  const email = profile.email || '';
  const phone = profile.phone || profile.mobile || '';
  const parentName = profile.parent_name || '';
  const parentPhone = profile.parent_phone || '';
  const schoolName = school?.name || school?.school_name || 'School';
  const designation = profile.designation || '';
  const department = profile.department || '';
  const employeeId = profile.employee_id || '';

  const isStudent = role === 'student' || role === 'parent';
  const isTeacher = role === 'teacher' || role === 'incharge';

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        old_password: passwords.current,
        new_password: passwords.new,
      });
      toast.success('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
    toast.success('Logged out successfully');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="Profile" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Profile Avatar & Name */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-5 pt-8 pb-12 text-center relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-white text-lg font-bold mt-3">{displayName}</h2>
            <p className="text-blue-100 text-sm capitalize">
              {role} {className && `| Class ${className}`} {section && `- ${section}`}
            </p>

            {/* Edit button on avatar card */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title="Edit Profile"
              >
                <PencilSquareIcon className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* Quick Info Badges */}
          <div className="flex items-center justify-center gap-3 -mt-5 px-4 relative z-10">
            {isStudent && rollNumber && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2 text-center">
                <p className="text-xs text-gray-500">Roll No</p>
                <p className="text-sm font-semibold text-gray-900">{rollNumber}</p>
              </div>
            )}
            {isStudent && admissionNumber && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2 text-center">
                <p className="text-xs text-gray-500">Admission</p>
                <p className="text-sm font-semibold text-gray-900">{admissionNumber}</p>
              </div>
            )}
            {isTeacher && employeeId && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2 text-center">
                <p className="text-xs text-gray-500">Employee ID</p>
                <p className="text-sm font-semibold text-gray-900">{employeeId}</p>
              </div>
            )}
            {isTeacher && designation && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2 text-center">
                <p className="text-xs text-gray-500">Designation</p>
                <p className="text-sm font-semibold text-gray-900">{designation}</p>
              </div>
            )}
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          )}
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <PencilSquareIcon className="w-4 h-4 text-blue-600" />
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <CheckIcon className="w-4 h-4" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <IdentificationIcon className="w-4 h-4 text-blue-600" />
            Personal Information
          </h3>
          <div className="space-y-3">
            <InfoRow icon={UserCircleIcon} label="Full Name" value={displayName} />
            {isStudent && className && (
              <InfoRow icon={AcademicCapIcon} label="Class & Section" value={`${className} ${section ? `- ${section}` : ''}`} />
            )}
            {isStudent && rollNumber && <InfoRow icon={IdentificationIcon} label="Roll Number" value={rollNumber} />}
            {isStudent && admissionNumber && <InfoRow icon={IdentificationIcon} label="Admission No" value={admissionNumber} />}
            {isTeacher && employeeId && <InfoRow icon={IdentificationIcon} label="Employee ID" value={employeeId} />}
            {isTeacher && designation && <InfoRow icon={AcademicCapIcon} label="Designation" value={designation} />}
            {isTeacher && department && <InfoRow icon={BuildingLibraryIcon} label="Department" value={department} />}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <EnvelopeIcon className="w-4 h-4 text-green-600" />
            Contact Information
          </h3>
          <div className="space-y-3">
            {email && <InfoRow icon={EnvelopeIcon} label="Email" value={email} />}
            {phone && <InfoRow icon={PhoneIcon} label="Phone" value={phone} />}
            {parentName && <InfoRow icon={UsersIcon} label="Parent Name" value={parentName} />}
            {parentPhone && <InfoRow icon={PhoneIcon} label="Parent Phone" value={parentPhone} />}
          </div>
        </div>

        {/* School Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <BuildingLibraryIcon className="w-4 h-4 text-purple-600" />
            School Information
          </h3>
          <div className="space-y-3">
            <InfoRow icon={BuildingLibraryIcon} label="School" value={schoolName} />
            {school?.address && <InfoRow icon={BuildingLibraryIcon} label="Address" value={school.address} />}
            {school?.phone && <InfoRow icon={PhoneIcon} label="School Phone" value={school.phone} />}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-amber-600" />
              Change Password
            </h3>
            <span className="text-xs text-blue-600 font-medium">
              {showPasswordForm ? 'Cancel' : 'Change'}
            </span>
          </button>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
              {/* Current Password */}
              <div className="relative">
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password */}
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? 'Changing...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 rounded-xl text-red-600 font-medium text-sm hover:bg-red-50 transition-colors shadow-sm"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

// Reusable info row component
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
