'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BookOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

export default function LibraryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      if (!localStorage.getItem('erp_token')) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['library-books', search],
    queryFn: async () => {
      const res = await api.get('/library/book/list', { params: { search: search || undefined, limit: 50 } });
      return res.data?.data || [];
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  const books = data || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="Library" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          />
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
            <p className="text-red-600 text-sm font-medium">Failed to load the library catalog</p>
            <button onClick={() => refetch()} className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && books.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <BookOpenIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">{search ? 'No books match your search' : 'No books in the catalog yet'}</p>
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                <div className="w-12 h-16 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <BookOpenIcon className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{book.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{book.author || 'Unknown author'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {book.category && (
                      <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{book.category}</span>
                    )}
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      book.available_copies > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                    }`}>
                      {book.available_copies > 0 ? `${book.available_copies} available` : 'All copies issued'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
