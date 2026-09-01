'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function MarkAttendancePage() {
  const { isAuthenticated, school } = useSelector((state) => state.auth);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated]);

  // Fetch classes assigned to teacher
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/school/classes');
        setClasses(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (isAuthenticated) fetchClasses();
  }, [isAuthenticated]);

  // Fetch sections when class changes
  useEffect(() => {
    if (!selectedClass) return;
    const fetchSections = async () => {
      try {
        const res = await api.get(`/school/sections?class_id=${selectedClass}`);
        setSections(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSections();
  }, [selectedClass]);

  // Fetch students and existing attendance
  useEffect(() => {
    if (!selectedClass || !selectedSection || !date) return;
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/attendance/student/get?class_id=${selectedClass}&section_id=${selectedSection}&date=${date}`,
        );
        const data = res.data.data;
        setStudents(data.students || []);
        setIsAlreadyMarked(data.is_marked);

        // Pre-fill attendance
        const att = {};
        data.students.forEach((s) => {
          att[s.student_id] = s.status || 'present'; // default to present
        });
        setAttendance(att);
      } catch (err) {
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedClass, selectedSection, date]);

  const toggleStatus = (studentId) => {
    const current = attendance[studentId] || 'present';
    const cycle = ['present', 'absent', 'late', 'half_day'];
    const nextIndex = (cycle.indexOf(current) + 1) % cycle.length;
    setAttendance({ ...attendance, [studentId]: cycle[nextIndex] });
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => { updated[s.student_id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        class_id: parseInt(selectedClass),
        section_id: parseInt(selectedSection),
        date,
        attendance: Object.entries(attendance).map(([student_id, status]) => ({
          student_id: parseInt(student_id),
          status,
        })),
      };
      await api.post('/attendance/student/mark', payload);
      toast.success('Attendance saved successfully!');
      setIsAlreadyMarked(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'absent': return <XCircleIcon className="h-6 w-6 text-red-600" />;
      case 'late': return <ClockIcon className="h-6 w-6 text-yellow-600" />;
      case 'half_day': return <ClockIcon className="h-6 w-6 text-orange-600" />;
      default: return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'present': return 'bg-green-50 border-green-200';
      case 'absent': return 'bg-red-50 border-red-200';
      case 'late': return 'bg-yellow-50 border-yellow-200';
      case 'half_day': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const stats = {
    present: Object.values(attendance).filter((v) => v === 'present').length,
    absent: Object.values(attendance).filter((v) => v === 'absent').length,
    late: Object.values(attendance).filter((v) => v === 'late').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Mark Attendance</h1>
          {isAlreadyMarked && (
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Already Marked</span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection(''); setStudents([]); }}
            className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Section</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Quick Actions */}
        {students.length > 0 && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => markAll('present')} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200">All Present</button>
            <button onClick={() => markAll('absent')} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200">All Absent</button>
          </div>
        )}

        {/* Student List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Select class, section, and date to view students</div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-green-600 font-medium">Present: {stats.present}</span>
              <span className="text-red-600 font-medium">Absent: {stats.absent}</span>
              <span className="text-yellow-600 font-medium">Late: {stats.late}</span>
              <span className="text-gray-500 ml-auto">Total: {students.length}</span>
            </div>

            <div className="space-y-2">
              {students.map((student) => (
                <button
                  key={student.student_id}
                  onClick={() => toggleStatus(student.student_id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${getStatusBg(attendance[student.student_id])}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-8">{student.roll_number || '#'}</span>
                    <span className="text-sm text-gray-800">{student.name || `Student #${student.student_id}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs capitalize text-gray-500">{attendance[student.student_id]}</span>
                    {getStatusIcon(attendance[student.student_id])}
                  </div>
                </button>
              ))}
            </div>

            {/* Submit */}
            <div className="sticky bottom-4 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg disabled:opacity-60"
              >
                {submitting ? 'Saving...' : isAlreadyMarked ? 'Update Attendance' : 'Save Attendance'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
