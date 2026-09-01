'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function EnterMarksPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exams, setExams] = useState([]);
  const [examSubjects, setExamSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  // Filters
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    fetchExams();
    fetchClasses();
  }, [isAuthenticated]);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exam/list');
      setExams(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/school/classes');
      setClasses(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!selectedClass) return;
    const fetchSections = async () => {
      try {
        const res = await api.get(`/school/sections?class_id=${selectedClass}`);
        setSections(res.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetchSections();
  }, [selectedClass]);

  // Fetch subjects when exam + class selected
  useEffect(() => {
    if (!selectedExam || !selectedClass) return;
    const fetchSubjects = async () => {
      try {
        const res = await api.get(`/exam/subjects?exam_id=${selectedExam}&class_id=${selectedClass}`);
        setExamSubjects(res.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetchSubjects();
  }, [selectedExam, selectedClass]);

  // Fetch students + existing marks
  useEffect(() => {
    if (!selectedExam || !selectedSubject || !selectedClass || !selectedSection) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/exam/marks/entry-data', {
          params: {
            exam_id: selectedExam,
            exam_subject_id: selectedSubject,
            class_id: selectedClass,
            section_id: selectedSection,
          },
        });
        const data = res.data.data;
        setStudents(data.students || []);

        // Pre-fill marks
        const existing = {};
        data.students.forEach((s) => {
          if (s.marks_obtained !== null) {
            existing[s.student_id] = s.marks_obtained.toString();
          }
        });
        setMarks(existing);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedExam, selectedSubject, selectedClass, selectedSection]);

  const handleMarksChange = (studentId, value) => {
    // Allow only valid numbers
    if (value === '' || (!isNaN(value) && Number(value) >= 0 && Number(value) <= maxMarks)) {
      setMarks({ ...marks, [studentId]: value });
    }
  };

  const handleSubmit = async () => {
    // Validate all marks filled
    const filledStudents = Object.entries(marks).filter(([_, v]) => v !== '');
    if (filledStudents.length === 0) {
      toast.error('Please enter marks for at least one student');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        exam_id: parseInt(selectedExam),
        exam_subject_id: parseInt(selectedSubject),
        max_marks: maxMarks,
        marks: filledStudents.map(([student_id, value]) => ({
          student_id: parseInt(student_id),
          marks_obtained: Number(value),
        })),
      };

      await api.post('/exam/marks/enter', payload);
      toast.success(`Marks saved for ${filledStudents.length} students`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save marks');
    } finally {
      setSubmitting(false);
    }
  };

  const getMarkColor = (value) => {
    if (!value || value === '') return '';
    const pct = (Number(value) / maxMarks) * 100;
    if (pct >= 80) return 'border-green-400 bg-green-50';
    if (pct >= 60) return 'border-blue-400 bg-blue-50';
    if (pct >= 33) return 'border-yellow-400 bg-yellow-50';
    return 'border-red-400 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Enter Marks</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <select
            value={selectedExam}
            onChange={(e) => { setSelectedExam(e.target.value); setSelectedSubject(''); setStudents([]); }}
            className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Exam</option>
            {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection(''); setStudents([]); }}
            className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Section</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              const sub = examSubjects.find(s => s.id == e.target.value);
              if (sub) setMaxMarks(sub.max_marks || 100);
            }}
            className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Subject</option>
            {examSubjects.map((s) => <option key={s.id} value={s.id}>{s.subject_name} (Max: {s.max_marks})</option>)}
          </select>
        </div>

        {/* Max marks display */}
        {selectedSubject && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <span>Max Marks:</span>
            <span className="font-bold text-gray-900">{maxMarks}</span>
            <span className="ml-auto text-xs text-gray-400">
              Filled: {Object.values(marks).filter(v => v !== '').length} / {students.length}
            </span>
          </div>
        )}

        {/* Student marks grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Select exam, class, section, and subject to begin</div>
        ) : (
          <>
            <div className="bg-white rounded-xl border overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="col-span-1">Roll</div>
                <div className="col-span-6">Student Name</div>
                <div className="col-span-3">Marks (out of {maxMarks})</div>
                <div className="col-span-2 text-center">Grade</div>
              </div>

              {/* Student rows */}
              {students.map((student) => {
                const value = marks[student.student_id] || '';
                const grade = value !== '' ? calculateGrade((Number(value) / maxMarks) * 100) : '-';

                return (
                  <div key={student.student_id} className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b last:border-0 hover:bg-gray-50">
                    <div className="col-span-1 text-sm text-gray-500">{student.roll_number || '#'}</div>
                    <div className="col-span-6 text-sm text-gray-800 font-medium truncate">{student.name}</div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        max={maxMarks}
                        step="0.5"
                        value={value}
                        onChange={(e) => handleMarksChange(student.student_id, e.target.value)}
                        placeholder="—"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm text-center font-medium outline-none focus:ring-2 focus:ring-blue-500 transition ${getMarkColor(value)}`}
                      />
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-semibold text-gray-600">{grade}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <div className="sticky bottom-4 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition shadow-lg disabled:opacity-60"
              >
                <CheckIcon className="h-5 w-5" />
                {submitting ? 'Saving...' : 'Save Marks'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function calculateGrade(percentage) {
  if (percentage >= 91) return 'A+';
  if (percentage >= 81) return 'A';
  if (percentage >= 71) return 'B+';
  if (percentage >= 61) return 'B';
  if (percentage >= 51) return 'C+';
  if (percentage >= 41) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
}
