'use client';

import { useState } from 'react';
import api from '../../services/api';

const initial = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  city: '',
  student_count: '',
  message: '',
};

export default function EnquiryForm({ source = 'contact' }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Please enter your name and email.');
      return;
    }

    setStatus('loading');
    try {
      await api.post('/enquiry', {
        ...form,
        student_count: form.student_count ? Number(form.student_count) : undefined,
        source,
      });
      setStatus('success');
      setForm(initial);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 px-6 animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-bold text-gray-900">Thank you!</h3>
        <p className="mt-2 text-gray-600">Our team will reach out to you shortly to schedule your demo.</p>
        <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-semibold text-primary-600 hover:underline">
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name *" value={form.name} onChange={update('name')} placeholder="Jane Doe" />
        <Field label="Work email *" type="email" value={form.email} onChange={update('email')} placeholder="jane@school.edu" />
        <Field label="Phone" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" />
        <Field label="School / Institute" value={form.organization} onChange={update('organization')} placeholder="Delhi Public School" />
        <Field label="City" value={form.city} onChange={update('city')} placeholder="New Delhi" />
        <Field label="Approx. students" type="number" value={form.student_count} onChange={update('student_count')} placeholder="800" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">How can we help?</label>
        <textarea
          value={form.message}
          onChange={update('message')}
          rows={4}
          placeholder="Tell us about your school and what you're looking for…"
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-primary-600 rounded-xl shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {status === 'loading' ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          'Request a Free Demo'
        )}
      </button>
      <p className="text-center text-xs text-gray-400">We'll never share your details. No spam, ever.</p>
    </form>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
      />
    </div>
  );
}
