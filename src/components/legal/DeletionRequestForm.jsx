'use client';

import { useState } from 'react';
import api from '../../services/api';

const ROLES = ['Student', 'Parent', 'Teacher', 'Staff', 'School admin'];

export default function DeletionRequestForm() {
  const [f, setF] = useState({ name: '', email: '', phone: '', school: '', role: 'Parent', details: '', confirm: false });
  const [state, setState] = useState({ status: 'idle', error: '' });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.confirm) return setState({ status: 'idle', error: 'Please confirm that you want your account deleted.' });
    setState({ status: 'loading', error: '' });
    try {
      await api.post('/enquiry', {
        name: f.name,
        email: f.email,
        phone: f.phone || undefined,
        organization: f.school,
        subject: 'Account deletion request',
        message: `Role: ${f.role}\n${f.details ? `Details: ${f.details}` : ''}`.trim(),
        source: 'account_deletion',
      });
      setState({ status: 'success', error: '' });
    } catch (err) {
      setState({ status: 'idle', error: err.response?.data?.message || 'Could not send your request. Please email us instead.' });
    }
  };

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Request received. We&apos;ll confirm with your school and email you within 30 days.
      </div>
    );
  }

  const input = 'w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15';
  return (
    <form onSubmit={submit} className="space-y-4" noValidate={false}>
      {state.error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="dr-name" label="Full name" required><input id="dr-name" required minLength={2} value={f.name} onChange={set('name')} className={input} autoComplete="name" /></Field>
        <Field id="dr-email" label="Email on the account" required><input id="dr-email" type="email" required value={f.email} onChange={set('email')} className={input} autoComplete="email" /></Field>
        <Field id="dr-phone" label="Phone on the account"><input id="dr-phone" type="tel" value={f.phone} onChange={set('phone')} className={input} autoComplete="tel" /></Field>
        <Field id="dr-school" label="School name or code" required><input id="dr-school" required value={f.school} onChange={set('school')} className={input} /></Field>
        <Field id="dr-role" label="I am a">
          <select id="dr-role" value={f.role} onChange={set('role')} className={input}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
        </Field>
      </div>
      <Field id="dr-details" label="Anything else we should know (optional)">
        <textarea id="dr-details" rows={3} value={f.details} onChange={set('details')} className={input} placeholder="e.g. student name and class, if you are a parent" />
      </Field>
      <label className="flex items-start gap-2.5 text-sm text-gray-600">
        <input type="checkbox" checked={f.confirm} onChange={set('confirm')} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
        I understand my account will be permanently deleted, and that my school may keep records it is legally required to keep.
      </label>
      <button type="submit" disabled={state.status === 'loading'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60">
        {state.status === 'loading' ? 'Sending…' : 'Request deletion'}
      </button>
    </form>
  );
}

function Field({ id, label, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</label>
      {children}
    </div>
  );
}
