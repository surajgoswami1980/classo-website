'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, ArrowDownTrayIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function ExamResultsPage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    fetchExams();
  }, [isAuthenticated]);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exam/list');
      // Only show published exams to students
      setExams((res.data.data || []).filter(e => e.is_published));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!selectedExam) return;
    const fetchReportCard = async () => {
      setLoading(true);
      try {
        const studentId = user.student_id || user.id;
        const res = await api.get(`/exam/report-card/${studentId}?exam_id=${selectedExam}`);
        setReportCard(res.data.data);
      } catch (err) {
        toast.error('Failed to load results');
        setReportCard(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReportCard();
  }, [selectedExam]);

  const downloadPdf = () => {
    const studentId = user.student_id || user.id;
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/exam/report-card/${studentId}/pdf?exam_id=${selectedExam}`, '_blank');
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': case 'A': return 'text-green-700 bg-green-50';
      case 'B+': case 'B': return 'text-blue-700 bg-blue-50';
      case 'C+': case 'C': return 'text-yellow-700 bg-yellow-50';
      case 'D': return 'text-orange-700 bg-orange-50';
      case 'F': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Exam Results</h1>
          {reportCard && (
            <button onClick={downloadPdf} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <ArrowDownTrayIcon className="h-4 w-4" /> Download PDF
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Exam Selector */}
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-6"
        >
          <option value="">Select Exam to view results</option>
          {exams.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.exam_type})</option>)}
        </select>

        {loading && <div className="text-center py-12 text-gray-500">Loading results...</div>}

        {reportCard && !loading && (
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-indigo-200 text-sm">{reportCard.exam.name}</p>
                  <p className="text-3xl font-bold mt-1">{reportCard.summary.percentage}%</p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${reportCard.summary.result === 'PASS' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                    {reportCard.summary.result}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-indigo-200 text-xs">Marks</p>
                  <p className="font-semibold">{reportCard.summary.total_marks_obtained}/{reportCard.summary.total_max_marks}</p>
                </div>
                <div>
                  <p className="text-indigo-200 text-xs">Grade</p>
                  <p className="font-semibold">{reportCard.summary.overall_grade}</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrophyIcon className="h-4 w-4 text-yellow-300" />
                  <div>
                    <p className="text-indigo-200 text-xs">Rank</p>
                    <p className="font-semibold">#{reportCard.summary.rank || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-wise Results */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <p className="text-sm font-semibold text-gray-700">Subject-wise Performance</p>
              </div>
              <div className="divide-y">
                {reportCard.subjects.map((subject, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{subject.subject_name}</p>
                      <p className="text-xs text-gray-400">Max: {subject.max_marks} | Pass: {subject.passing_marks || 33}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">{subject.marks_obtained ?? '-'}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getGradeColor(subject.grade)}`}>
                        {subject.grade}
                      </span>
                      {subject.passed ? (
                        <span className="text-xs text-green-600">✓</span>
                      ) : (
                        <span className="text-xs text-red-600">✗</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class comparison */}
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Class Comparison</p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500">Your Score</p>
                  <p className="text-lg font-bold text-blue-600">{reportCard.summary.percentage}%</p>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${reportCard.summary.percentage}%` }}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class Avg</p>
                  <p className="text-lg font-bold text-gray-600">{reportCard.summary.class_average}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
