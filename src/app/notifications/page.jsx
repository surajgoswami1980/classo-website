'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import {
  BellIcon,
  BellAlertIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('erp_token');
      if (!token) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const { data: notificationsData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['notifications-all'],
    queryFn: async () => {
      const res = await api.get('/notification/list');
      return res.data?.data || res.data;
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  const markReadMutation = useMutation({
    mutationFn: async (notifId) => {
      await api.put(`/notification/${notifId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
    onError: () => {
      toast.error('Failed to mark as read');
    },
  });

  const notifications = notificationsData?.notifications || notificationsData || [];
  const unreadCount = notifications.filter((n) => !n.is_read && !n.read_at).length;

  const handleNotificationTap = (notif) => {
    const id = notif._id || notif.id;
    if (!notif.is_read && !notif.read_at && id) {
      markReadMutation.mutate(id);
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getNotifIcon = (type) => {
    // You can expand these based on notification types
    switch (type) {
      case 'assignment':
        return '📝';
      case 'attendance':
        return '📋';
      case 'exam':
        return '📊';
      case 'fee':
        return '💰';
      case 'event':
        return '🎉';
      default:
        return '📢';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="Notifications" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Header with refresh & count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">All Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 text-gray-500 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
            <p className="text-red-600 text-sm font-medium">Failed to load notifications</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !error && (
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notif, idx) => {
                const isRead = notif.is_read || notif.read_at;
                const id = notif._id || notif.id || idx;

                return (
                  <button
                    key={id}
                    onClick={() => handleNotificationTap(notif)}
                    className={`w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all duration-200 hover:shadow-md ${
                      !isRead ? 'border-blue-100 bg-blue-50/30' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !isRead ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-lg">
                          {getNotifIcon(notif.type || notif.category)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm truncate ${
                            !isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                          }`}>
                            {notif.title}
                          </h4>
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notif.message || notif.body || notif.description}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          {getTimeAgo(notif.created_at || notif.createdAt || notif.sent_at)}
                        </p>
                      </div>
                    </div>

                    {/* Mark as read indicator */}
                    {!isRead && (
                      <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-50">
                        <span className="flex items-center gap-1 text-[11px] text-blue-600">
                          <CheckIcon className="w-3 h-3" />
                          Tap to mark as read
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <BellIcon className="w-10 h-10 text-blue-300" />
                </div>
                <h3 className="text-gray-700 font-medium">No Notifications</h3>
                <p className="text-gray-400 text-sm mt-1">
                  You&apos;re all caught up! 🎉
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
