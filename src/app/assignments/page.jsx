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
    title: '', topic: '', description: '', due_date: '', max_marks: 100,
  });

  // Student submit modal state
  const [submitFor, setSubmitFor] = useState(null);
  const [submitText, setSubmitText] = useState('');
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  // Teacher grade modal state
  const [gradeFor, setGradeFor] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/upload?folder=submissions', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = res.data?.data;
      setSubmitUrl(data.url);
      setSubmitFileName(data.name || file.name);
      toast.success('File attached');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submitMutation = useMutation({
    mutationFn: async ({ id, body }) => (await api.post(`/assignment/${id}/submit`, body)).data,
    onSuccess: () => {
      toast.success('Submitted!');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setSubmitFor(null); setSubmitText(''); setSubmitUrl(''); setSubmitFileName('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit'),
  });

  const doSubmit = () => {
    if (!submitText.trim() && !submitUrl.trim()) { toast.error('Add a description or file link'); return; }
    const type = /\.pdf($|\?)/i.test(submitUrl) ? 'pdf' : (/\.(png|jpe?g|webp)($|\?)/i.test(submitUrl) ? 'image' : (submitUrl ? 'doc' : null));
    submitMutation.mutate({ id: submitFor.id, body: { description: submitText, attachment_url: submitUrl || null, attachment_type: type } });
  };

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
    <div className="min-h-screen aurora-bg pb-20 md:pb-6">
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Chapter 5 — Fractions"
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
              const sub = a.submission;
              const st = a.effective_status || sub?.status || (isPastDue ? 'missed' : 'pending');
              const stBadge = {
                pending: isPastDue ? ['Missed', 'bg-red-100 text-red-600'] : ['To do', 'bg-orange-100 text-orange-600'],
                submitted: ['Submitted', 'bg-blue-100 text-blue-600'],
                graded: ['Graded', 'bg-emerald-100 text-emerald-600'],
                missed: ['Missed', 'bg-red-100 text-red-600'],
              }[st] || [st, 'bg-gray-100 text-gray-500'];
              return (
                <div
                  key={a.id}
                  className={`bg-white rounded-xl border shadow-sm p-4 ${isPastDue ? 'border-gray-200' : 'border-orange-100'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{a.title}</h4>
                      {a.topic && <p className="text-xs text-blue-600 mt-0.5">{a.topic}</p>}
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

                      {/* Student: marks + submit */}
                      {isStudent && (
                        <div className="mt-3">
                          {st === 'graded' && sub ? (
                            <div className="inline-flex flex-col gap-0.5 bg-emerald-50 rounded-lg px-3 py-2">
                              <span className="text-sm font-bold text-emerald-700">Marks: {sub.marks} / {a.max_marks}</span>
                              {sub.feedback && <span className="text-xs text-gray-500 italic">“{sub.feedback}”</span>}
                            </div>
                          ) : st === 'submitted' ? (
                            <span className="text-xs font-semibold text-blue-600">Submitted{sub?.is_late ? ' (late)' : ''} — awaiting marks</span>
                          ) : !isPastDue ? (
                            <button
                              onClick={() => { setSubmitFor(a); setSubmitText(sub?.description || ''); setSubmitUrl(sub?.attachment_url || ''); setSubmitFileName(''); }}
                              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                              Submit
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-red-500">Not submitted — marked 0</span>
                          )}
                        </div>
                      )}

                      {/* Teacher: progress */}
                      {isTeacher && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">{a.submitted_count || 0} submitted</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">{a.graded_count || 0} graded</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${stBadge[1]}`}>{isTeacher ? (isPastDue ? 'Closed' : 'Active') : stBadge[0]}</span>
                      {isTeacher && (
                        <>
                          <button onClick={() => setGradeFor(a)} className="p-1.5 rounded-lg hover:bg-blue-50 transition" title="Grade">
                            <AcademicCapIcon className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => { if (confirm('Delete this assignment?')) deleteMutation.mutate(a.id); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition"
                          >
                            <TrashIcon className="w-4 h-4 text-red-400" />
                          </button>
                        </>
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

      {/* Student submit modal */}
      {submitFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setSubmitFor(null); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Submit: {submitFor.title}</h3>
            <p className="text-xs text-gray-400 mb-4">Type your answer and optionally paste an image/PDF link.</p>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your answer / notes</label>
            <textarea value={submitText} onChange={(e) => setSubmitText(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
            <label className="block text-xs font-medium text-gray-600 mb-1">Attach a file (PDF / image)</label>
            <label className={`flex items-center justify-center gap-2 w-full px-3 py-2.5 border border-dashed border-blue-400 rounded-lg text-sm text-blue-600 cursor-pointer hover:bg-blue-50 mb-2 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
              <input type="file" accept=".pdf,image/*,.doc,.docx" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              {uploading ? 'Uploading…' : (submitFileName ? 'Replace attached file' : 'Choose a file from your device')}
            </label>
            {submitFileName && (
              <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 mb-3">
                <span className="flex-1 truncate text-xs text-gray-700">{submitFileName}</span>
                <button type="button" onClick={() => { setSubmitUrl(''); setSubmitFileName(''); }} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-4 h-4" /></button>
              </div>
            )}
            <label className="block text-xs font-medium text-gray-600 mb-1">Or paste a file link (optional)</label>
            <input type="text" value={submitUrl} onChange={(e) => { setSubmitUrl(e.target.value); setSubmitFileName(''); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4" placeholder="https://…" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setSubmitFor(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm">Cancel</button>
              <button onClick={doSubmit} disabled={submitMutation.isPending} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-60">{submitMutation.isPending ? 'Submitting…' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher grade modal */}
      {gradeFor && (
        <GradeModal assignment={gradeFor} onClose={() => { setGradeFor(null); queryClient.invalidateQueries({ queryKey: ['assignments'] }); }} />
      )}

      <BottomNav />
    </div>
  );
}

function GradeModal({ assignment, onClose }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['submissions', assignment.id],
    queryFn: async () => (await api.get(`/assignment/${assignment.id}/submissions`)).data?.data,
  });
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});
  const gradeMutation = useMutation({
    mutationFn: async ({ student_id, m, f }) => (await api.post(`/assignment/${assignment.id}/grade`, { student_id, marks: Number(m), feedback: f || '' })).data,
    onSuccess: () => { toast.success('Marks saved'); queryClient.invalidateQueries({ queryKey: ['submissions', assignment.id] }); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  const rows = data?.submissions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Grade: {assignment.title}</h3>
          <button onClick={onClose}><XMarkIcon className="w-5 h-5 text-gray-400" /></button>
        </div>
        {isLoading ? (
          <p className="text-center py-8 text-gray-400">Loading…</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {rows.map((r) => (
              <div key={r.student_id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{r.student_name}</p>
                  <p className="text-xs text-gray-400">{r.status}{r.is_late ? ' · late' : ''}{r.attachment_url ? ' · has file' : ''}</p>
                  {r.description && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{r.description}</p>}
                  {r.attachment_url && (
                    <a href={r.attachment_url.startsWith('http') ? r.attachment_url : '#'} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-semibold">View file</a>
                  )}
                </div>
                <input
                  type="number" min={0} max={assignment.max_marks} placeholder="0"
                  defaultValue={r.marks ?? ''}
                  onChange={(e) => setMarks({ ...marks, [r.student_id]: e.target.value })}
                  className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text" placeholder="Feedback"
                  defaultValue={r.feedback ?? ''}
                  onChange={(e) => setFeedback({ ...feedback, [r.student_id]: e.target.value })}
                  className="w-32 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={() => gradeMutation.mutate({ student_id: r.student_id, m: marks[r.student_id] ?? r.marks ?? 0, f: feedback[r.student_id] ?? r.feedback })}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                >
                  Save
                </button>
              </div>
            ))}
            {rows.length === 0 && <p className="text-center py-8 text-gray-400">No students found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
