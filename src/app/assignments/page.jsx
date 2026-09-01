'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  PlusIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { hydrateAuth } from '../../store/slices/authSlice';
import api from '../../services/api';
import StudentHeader from '../../components/StudentHeader';
import BottomNav from '../../components/BottomNav';

export default function AssignmentsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      if (!localStorage.getItem('erp_token')) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const role = user?.role;
  const isTeacher = role === 'teacher' || role === 'incharge';
  const isStudent = role === 'student' || role === 'parent';

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    class_id: '', section_id: '', subject_id: '',
    title: '', description: '', due_date: '', max_marks: 100,
  });

  // Fetch classes for teacher
  useEffect(() => {
    if (isTeacher && isAuthenticated) {
      api.get('/school/classes').then(res => setClasses(res.data.data || [])).catch(() => {});
    }
  }, [isTeacher, isAuthenticated]);

  // Fetch sections when class changes
  useEffect(() => {
    if (formData.class_id) {
      api.get(`/school/sections?class_id=${formData.class_id}`).then(res => setSections(res.data.data || [])).catch(() => {});
    }
  }, [formData.class_id]);

  // Fetch assignments
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ['assignments', role],
    queryFn: async () => {
      const endpoint = isStudent ? '/assignment/student/list' : '/assignment/list';
      const res = await api.get(endpoint);
      return res.data?.data || [];
    },
    enabled: isAuthenticated,
  });

  // Create assignment mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/assignment/create', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Assignment created!');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setShowCreateForm(false);
      setFormData({ class_id: '', section_id: '', subject_id: '', title: '', description: '', due_date: '', max_marks: 100 });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  // Delete assignment
  const deleteMutation = useMutation({
    mutationFn: async (id) => { await api.delete(`/assignment/${id}`); },
    onSuccess: () => {
      toast.success('Assignment deleted');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: () => toast.error('Failed to delete'),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.class_id || !formData.section_id || !formData.due_date) {
      toast.error('Please fill required fields');
      return;
    }
    createMutation.mutate({
      ...formData,
      class_id: parseInt(formData.class_id),
      section_id: parseInt(formData.section_id),
      subject_id: parseInt(formData.subject_id) || 0,
      max_marks: parseInt(formData.max_marks) || 100,
    });
  };

  const assignments = assignmentsData || [];

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <StudentHeader title="Assignments" showBack />

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Header with create button for teachers */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {isTeacher ? 'My Assignments' : 'Assignments'}
          </h2>
          {isTeacher && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              {showCreateForm ? <XMarkIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
              {showCreateForm ? 'Cancel' : 'Create'}
            </button>
          )}
        </div>

        {/* Create Form (Teacher) */}
        {showCreateForm && isTeacher && (
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 text-blue-600" />
              Create New Assignment
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Class *</label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value, section_id: '' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Section *</label>
                  <select
                    value={formData.section_id}
                    onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Assignment title"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  placeholder="Instructions for students..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={formData.max_marks}
                    onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    min={1}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Assignment'}
              </button>
            </form>
          </div>
        )}

        {/* Assignments List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.map((a) => {
              const isPastDue = new Date(a.due_date) < new Date();
              return (
                <div
                  key={a.id}
                  className={`bg-white rounded-xl border shadow-sm p-4 ${isPastDue ? 'border-gray-200' : 'border-orange-100'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{a.title}</h4>
                      {a.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3.5 h-3.5" />
                          Due: {a.due_date ? format(new Date(a.due_date), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                        {a.max_marks && (
                          <span className="flex items-center gap-1">
                            <AcademicCapIcon className="w-3.5 h-3.5" />
                            {a.max_marks} marks
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {isPastDue ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">Past Due</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-600">Active</span>
                      )}
                      {isTeacher && (
                        <button
                          onClick={() => { if (confirm('Delete this assignment?')) deleteMutation.mutate(a.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          <TrashIcon className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-200 mb-3" />
            <h3 className="text-gray-600 font-medium">No Assignments</h3>
            <p className="text-gray-400 text-sm mt-1">
              {isTeacher ? 'Create your first assignment above' : 'No assignments from your teacher yet'}
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
