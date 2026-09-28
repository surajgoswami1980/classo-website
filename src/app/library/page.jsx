'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BookOpenIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

export default function LibraryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('my'); // 'my' | 'catalog'

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      if (!localStorage.getItem('erp_token')) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Student's own issued books + outstanding fines
  const { data: myData, isLoading: myLoading, error: myError, refetch: refetchMy } = useQuery({
    queryKey: ['my-books'],
    queryFn: async () => {
      const res = await api.get('/library/my-books');
      return res.data?.data || { books: [], summary: {} };
    },
    enabled: isAuthenticated,
  });

  // Catalog browse
  const { data: catalogData, isLoading: catalogLoading, error: catalogError, refetch: refetchCatalog } = useQuery({
    queryKey: ['library-books', search],
    queryFn: async () => {
      const res = await api.get('/library/book/list', { params: { search: search || undefined, limit: 50 } });
      return res.data?.data || [];
    },
    enabled: isAuthenticated && tab === 'catalog',
  });

  if (!isAuthenticated) return null;

  const myBooks = myData?.books || [];
  const summary = myData?.summary || {};
  const catalog = catalogData || [];

  const statusBadge = (book) => {
    if (book.status === 'returned') return 'text-gray-600 bg-gray-100';
    if (book.is_overdue) return 'text-red-700 bg-red-50';
    return 'text-blue-700 bg-blue-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="Library" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('my')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'my' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            My Books
          </button>
          <button
            onClick={() => setTab('catalog')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'catalog' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Browse Catalog
          </button>
        </div>

        {/* ── MY BOOKS ─────────────────────────────── */}
        {tab === 'my' && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{summary.total_issued ?? 0}</p>
                <p className="text-xs text-gray-500 mt-0.5">Issued</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{summary.overdue ?? 0}</p>
                <p className="text-xs text-gray-500 mt-0.5">Overdue</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">₹{Number(summary.outstanding_fine ?? 0).toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-0.5">Fine Due</p>
              </div>
            </div>

            {Number(summary.outstanding_fine) > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">You have an outstanding library fine of ₹{Number(summary.outstanding_fine).toFixed(2)}. Please settle it at the library counter.</p>
              </div>
            )}

            {myLoading && (
              <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20" />)}</div>
            )}

            {myError && !myLoading && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
                <p className="text-red-600 text-sm font-medium">Failed to load your books</p>
                <button onClick={() => refetchMy()} className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Retry</button>
              </div>
            )}

            {!myLoading && !myError && myBooks.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <BookOpenIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">You don't have any issued books right now.</p>
              </div>
            )}

            {!myLoading && myBooks.length > 0 && (
              <div className="space-y-3">
                {myBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                    <div className="w-12 h-16 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <BookOpenIcon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{book.book_title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{book.book_author || 'Unknown author'}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusBadge(book)}`}>
                          {book.status === 'returned' ? 'Returned' : book.is_overdue ? 'Overdue' : 'Issued'}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Due {book.due_date ? format(new Date(book.due_date), 'dd MMM yyyy') : '—'}
                        </span>
                        {book.status === 'issued' && book.days_to_expire !== null && (
                          <span className={`text-[11px] font-medium ${book.is_overdue ? 'text-red-600' : 'text-gray-500'}`}>
                            {book.is_overdue ? `${Math.abs(book.days_to_expire)}d overdue` : `${book.days_to_expire}d left`}
                          </span>
                        )}
                        {Number(book.current_fine) > 0 && (
                          <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            Fine ₹{Number(book.current_fine).toFixed(2)}{book.fine_paid ? ' (paid)' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── CATALOG ─────────────────────────────── */}
        {tab === 'catalog' && (
          <>
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

            {catalogLoading && (
              <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20" />)}</div>
            )}

            {catalogError && !catalogLoading && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
                <p className="text-red-600 text-sm font-medium">Failed to load the library catalog</p>
                <button onClick={() => refetchCatalog()} className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Retry</button>
              </div>
            )}

            {!catalogLoading && !catalogError && catalog.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <BookOpenIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">{search ? 'No books match your search' : 'No books in the catalog yet'}</p>
              </div>
            )}

            {!catalogLoading && catalog.length > 0 && (
              <div className="space-y-3">
                {catalog.map((book) => (
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
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${book.available_copies > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                          {book.available_copies > 0 ? `${book.available_copies} available` : 'All copies issued'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
