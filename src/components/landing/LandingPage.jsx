'use client';

import { useState } from 'react';
import Link from 'next/link';
import QuiloLogo from '../QuiloLogo';
import LandingNav from './LandingNav';
import EnquiryForm from './EnquiryForm';
import useReveal from './useReveal';
import { MarketingFooter } from './MarketingShell';

/*
 | White-and-blue marketing landing page for MyClasses.
 | Layout follows the approved reference: light hero + product mockup, trust
 | bar, "built for schools", 3-step how-it-works, testimonials, full feature
 | grid, platform preview and pricing. All copy/numbers live here so they are
 | easy to edit. Marketing figures (500+ schools etc.) are illustrative.
*/

// All ERP modules, with a tone for the colored icon tile (white+blue palette with soft accents).
const FEATURES = [
  { icon: 'users', title: 'Students & Admissions', tone: 'blue', desc: 'Enrollment, profiles, bulk CSV import, promotions and transfers.' },
  { icon: 'rupee', title: 'Fees & Payments', tone: 'green', desc: 'Fee structures, online collection, invoices, receipts and defaulters.' },
  { icon: 'check', title: 'Attendance (Face + GPS)', tone: 'sky', desc: 'Student and staff attendance, self check-in, reports and alerts.' },
  { icon: 'cap', title: 'Academics', tone: 'indigo', desc: 'Classes, sections, subjects and the full academic structure.' },
  { icon: 'doc', title: 'Exams & Results', tone: 'rose', desc: 'Marks entry, grading, report cards and result analytics.' },
  { icon: 'video', title: 'Live & Online Classes', tone: 'cyan', desc: 'Share and join class links, with the timetable built in.' },
  { icon: 'pencil', title: 'Homework & Assignments', tone: 'amber', desc: 'Distribute homework, collect submissions and track deadlines.' },
  { icon: 'calendar', title: 'Timetable', tone: 'violet', desc: 'Weekly period scheduling per class, section and teacher.' },
  { icon: 'bus', title: 'Transport Management', tone: 'orange', desc: 'Routes, stops, vehicles, drivers and student assignment.' },
  { icon: 'book', title: 'Library Management', tone: 'teal', desc: 'Book catalog, issue and return, fines and history.' },
  { icon: 'ticket', title: 'Events & Store', tone: 'pink', desc: 'Publish events with ticketing and sell items from the school store.' },
  { icon: 'home', title: 'Hostel Management', tone: 'blue', desc: 'Blocks, rooms and student allocation.' },
  { icon: 'box', title: 'Inventory', tone: 'green', desc: 'Categories, items, stock and transaction history.' },
  { icon: 'cash', title: 'Payroll', tone: 'indigo', desc: 'Staff salary structures and payslips.' },
  { icon: 'chart', title: 'Reports & Analytics', tone: 'sky', desc: 'Collection, attendance and performance insights.' },
  { icon: 'bell', title: 'Notifications', tone: 'rose', desc: 'Push, SMS and email — by class, section or everyone.' },
  { icon: 'branch', title: 'Multi-Branch Support', tone: 'cyan', desc: 'Run multiple schools and branches from one platform.' },
  { icon: 'shield', title: 'Roles & Permissions', tone: 'violet', desc: 'Fine-grained team roles and access control.' },
];

const STATS = [
  { value: '500+', label: 'Schools & Institutes', icon: 'building' },
  { value: '3,00,000+', label: 'Students', icon: 'users' },
  { value: '25,000+', label: 'Teachers & Staff', icon: 'cap' },
  { value: '99.9%', label: 'Uptime & Reliability', icon: 'bolt' },
];

const BUILT = [
  'Modern and intuitive interface',
  'Works on Web, Android and iOS',
  'Multi-tenant and scalable',
  'Secure payments with Razorpay / Cashfree',
  'Dedicated support and regular updates',
];

const STEPS = [
  { n: '1', icon: 'userplus', title: 'Sign Up', desc: 'Create your account and add your school details.' },
  { n: '2', icon: 'settings', title: 'Set Up', desc: 'Configure your modules, classes and settings.' },
  { n: '3', icon: 'rocket', title: 'Go Live', desc: 'Start managing your school and invite your team.' },
];

const TESTIMONIALS = [
  { name: 'Ravi Kumar', role: 'Principal, Sunrise International School', text: 'MyClasses made our school operations so much easier. Fees, attendance and communication are all in one place.' },
  { name: 'Neha Sharma', role: 'Director, Lotus Global Academy', text: 'The mobile app is very convenient for parents and teachers. Highly recommended for modern schools.' },
  { name: 'Amit Verma', role: 'Founder, Bright Future School', text: 'A great platform with excellent support. The attendance and fee modules work really well for us.' },
];

const PLANS = [
  { name: 'Starter', blurb: 'Perfect for small schools', monthly: 2999, yearly: 28790, limit: 'Up to 500 students', cta: 'Get Started', popular: false,
    features: ['All core modules', 'Email & chat support', 'Web + mobile apps'] },
  { name: 'Professional', blurb: 'Best for growing schools', monthly: 5999, yearly: 57590, limit: 'Up to 2,000 students', cta: 'Get Started', popular: true,
    features: ['All modules + advanced features', 'Priority support', 'Reports & analytics'] },
  { name: 'Enterprise', blurb: 'For large & multi-branch', monthly: null, yearly: null, limit: 'Unlimited students', cta: 'Contact Sales', popular: false,
    features: ['Multi-branch support', 'Dedicated account manager', 'Onboarding & training'] },
];

const PREVIEW_TABS = ['Admin Panel', 'School Admin', 'Student/Parent App', 'Teacher App'];

export default function LandingPage() {
  useReveal();
  const [billing, setBilling] = useState('monthly'); // monthly | yearly
  const [tab, setTab] = useState(0);

  const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <LandingNav />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF2FF] via-[#F4F8FF] to-white pt-28 pb-20">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Trusted by Modern Schools &amp; Coaching Institutes
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0F2A52] sm:text-5xl lg:text-6xl">
              Smarter Schools<br /><span className="text-primary-600">Brighter Futures</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-600">
              MyClasses is an all-in-one school management platform that simplifies admissions, academics, attendance, fees and communication — across web, Android and iOS.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-0.5 hover:bg-primary-700">
                Book a Free Demo
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <a href="#preview" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-primary-200 hover:text-primary-700">
                <svg className="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Watch Preview
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {['Easy to Use', 'Secure & Reliable', 'All Devices', 'Dedicated Support'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Product mockup: dashboard card + floating phone */}
          <div className="relative">
            <DashboardMock />
            <div className="absolute -bottom-6 -left-2 hidden w-52 sm:block">
              <PhoneMock />
            </div>
            <div className="absolute -right-3 top-6 hidden rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-gray-100 md:block">
              <p className="text-[11px] font-medium text-gray-400">Fees This Month</p>
              <p className="mt-0.5 text-lg font-extrabold text-[#0F2A52]">₹12,48,000</p>
              <p className="text-[11px] font-semibold text-emerald-600">▲ 18%</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STATS ───────────────────────────────────────── */}
      <section className="relative z-10 -mt-8 px-5 sm:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`reveal reveal-delay-${i} flex items-center gap-3`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Ico name={s.icon} /></span>
              <div>
                <p className="text-xl font-extrabold text-[#0F2A52]">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURE GRID ──────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl reveal">
              <span className="text-sm font-bold uppercase tracking-wider text-primary-600">Why MyClasses</span>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0F2A52] sm:text-4xl">Everything you need in one platform</h2>
              <p className="mt-3 text-gray-600">Powerful modules to run your school or coaching institute smoothly.</p>
            </div>
            <Link href="/features" className="shrink-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700">View All Features →</Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`reveal reveal-delay-${i % 6} group rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${tone(f.tone)} transition-transform group-hover:scale-110`}>
                  <Ico name={f.icon} />
                </div>
                <h3 className="mt-3 text-[13px] font-bold leading-snug text-[#0F2A52]">{f.title}</h3>
                <p className="mt-1 hidden text-xs leading-relaxed text-gray-500 sm:block">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUILT FOR SCHOOLS ─────────────────────────────────── */}
      <section id="about" className="bg-[#F4F8FF] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="reveal">
            <span className="text-sm font-bold uppercase tracking-wider text-primary-600">About MyClasses</span>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0F2A52] sm:text-4xl">Built for Schools, Designed for People</h2>
            <p className="mt-4 text-gray-600">We help schools, coaching institutes and educational organizations go digital with a simple, powerful and secure platform.</p>
            <ul className="mt-6 space-y-3">
              {BUILT.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[15px] text-gray-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-block rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700">Learn More About Us</Link>
          </div>
          <div className="relative reveal reveal-delay-1">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-navy-900 p-1 shadow-2xl">
              <div className="rounded-[1.4rem] bg-white p-8">
                <div className="flex items-center gap-3">
                  <QuiloLogo size={40} />
                  <div><p className="font-black text-[#0F2A52]">MyClasses</p><p className="text-xs text-gray-400">Digital transformation for every school</p></div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  {[['1,248', 'Students'], ['86', 'Teachers'], ['92%', 'Present']].map(([v, l]) => (
                    <div key={l} className="rounded-xl bg-primary-50 p-3"><p className="text-lg font-extrabold text-primary-700">{v}</p><p className="text-[11px] text-gray-500">{l}</p></div>
                  ))}
                </div>
                <div className="mt-5 flex h-24 items-end gap-2">
                  {[45, 62, 50, 78, 60, 88, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary-600 to-cyan-400" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <span className="absolute -right-3 -top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary-700 shadow-lg ring-1 ring-primary-100">Trusted by 500+ Schools</span>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="text-sm font-bold uppercase tracking-wider text-primary-600 reveal">How it works</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[#0F2A52] sm:text-4xl reveal">Get Started in 3 Simple Steps</h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className={`reveal reveal-delay-${i} relative`}>
                {i < STEPS.length - 1 && <div className="absolute left-[60%] top-8 hidden h-px w-[80%] border-t-2 border-dashed border-primary-200 sm:block" />}
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                  <Ico name={s.icon} />
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs font-extrabold text-white">{s.n}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#0F2A52]">{s.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM PREVIEW ──────────────────────────────────── */}
      <section id="preview" className="bg-[#F4F8FF] py-20">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <span className="text-sm font-bold uppercase tracking-wider text-primary-600 reveal">Platform preview</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[#0F2A52] sm:text-4xl reveal">Powerful &amp; Easy to Use</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600 reveal">A modern interface for school admins, teachers, students and parents.</p>

          <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm">
            {PREVIEW_TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === i ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:text-primary-700'}`}>{t}</button>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="hidden w-full max-w-2xl lg:block"><DashboardMock dark={tab === 0} /></div>
            <div className="w-44 shrink-0"><PhoneMock /></div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center reveal">
            <span className="text-sm font-bold uppercase tracking-wider text-primary-600">What our clients say</span>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0F2A52] sm:text-4xl">Loved by Educators</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`reveal reveal-delay-${i} rounded-2xl border border-gray-100 bg-white p-6 shadow-sm`}>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, k) => <Star key={k} />)}</div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">{t.name.charAt(0)}</span>
                  <div><p className="text-sm font-bold text-[#0F2A52]">{t.name}</p><p className="text-xs text-gray-500">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="bg-[#F4F8FF] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center reveal">
            <span className="text-sm font-bold uppercase tracking-wider text-primary-600">Pricing</span>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0F2A52] sm:text-4xl">Simple &amp; Transparent Pricing</h2>
            <p className="mt-3 text-gray-600">Choose a plan that fits your school&apos;s needs. No hidden charges.</p>
            <div className="mt-6 inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-sm">
              <button onClick={() => setBilling('monthly')} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${billing === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>Monthly</button>
              <button onClick={() => setBilling('yearly')} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${billing === 'yearly' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>Yearly <span className="text-emerald-500">Save 20%</span></button>
            </div>
          </div>

          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <div key={p.name} className={`reveal reveal-delay-${i} relative flex flex-col rounded-2xl border p-7 transition hover:-translate-y-1 ${p.popular ? 'border-primary-500 bg-white shadow-2xl shadow-primary-500/20' : 'border-gray-200 bg-white shadow-sm'}`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white shadow-lg">Most Popular</span>}
                <h3 className="text-lg font-bold text-[#0F2A52]">{p.name}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{p.blurb}</p>
                <div className="mt-4 flex items-end gap-1">
                  {p.monthly === null
                    ? <span className="text-3xl font-extrabold text-primary-700">Contact Us</span>
                    : <><span className="text-4xl font-extrabold text-[#0F2A52]">{money(billing === 'monthly' ? p.monthly : Math.round(p.yearly / 12))}</span><span className="mb-1 text-gray-400">/mo</span></>}
                </div>
                <p className="mt-1 text-xs text-gray-500">{p.limit}{p.monthly !== null && billing === 'yearly' ? ` · billed ${money(p.yearly)}/yr` : ''}</p>
                <div className="my-5 h-px bg-gray-100" />
                <ul className="flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`mt-7 rounded-xl px-5 py-3 text-center text-sm font-bold transition ${p.popular ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA + ENQUIRY ─────────────────────────────────────── */}
      <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-primary-700 to-primary-600 py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="text-white reveal">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Ready to Transform Your School?</h2>
            <p className="mt-4 text-lg text-white/80">Join hundreds of schools already using MyClasses. Book a free demo and see it running with your data in minutes.</p>
            <div className="mt-8 space-y-4">
              {[['Personalized walkthrough', 'Tailored to your school size and needs.'], ['Fast onboarding', 'Bulk import students and staff — go live in days.'], ['Dedicated support', 'A real human to help you every step of the way.']].map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></span>
                  <div><p className="font-semibold">{t}</p><p className="text-sm text-white/70">{d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9 reveal reveal-delay-1">
            <h3 className="text-xl font-bold text-[#0F2A52]">Book a Free Demo</h3>
            <p className="mb-6 mt-1 text-sm text-gray-500">Fill in your details and we&apos;ll be in touch.</p>
            <EnquiryForm source="landing_contact" />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

/* ── Product mockups (pure CSS, no external images) ──────────────── */
function DashboardMock({ dark = false }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs font-medium text-gray-400">app.myclasses.in</span>
      </div>
      <div className="flex">
        <div className={`hidden w-36 shrink-0 space-y-1.5 p-3 sm:block ${dark ? 'bg-navy-900' : 'bg-[#0F2A52]'} rounded-bl-2xl`}>
          <div className="flex items-center gap-2 px-1 pb-2"><QuiloLogo size={20} /><span className="text-xs font-bold text-white">MyClasses</span></div>
          {['Dashboard', 'Students', 'Attendance', 'Fees', 'Exams', 'Reports'].map((l, i) => (
            <div key={l} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${i === 0 ? 'bg-primary-600 text-white' : 'text-white/60'}`}>{l}</div>
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-4 gap-2">
            {[['Students', '1,248', 'bg-blue-50 text-blue-600'], ['Teachers', '86', 'bg-emerald-50 text-emerald-600'], ['Present', '92%', 'bg-violet-50 text-violet-600'], ['Fees', '₹12.4L', 'bg-amber-50 text-amber-600']].map(([l, v, c]) => (
              <div key={l} className="rounded-xl border border-gray-100 p-2.5"><span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold ${c}`}>{l}</span><p className="mt-1 text-sm font-extrabold text-[#0F2A52]">{v}</p></div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-gray-100 p-3">
            <p className="text-[11px] font-semibold text-gray-500">Fee Collection Overview</p>
            <div className="mt-2 flex h-20 items-end gap-1.5">
              {[40, 58, 48, 72, 55, 85, 68, 90].map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary-600 to-cyan-400" style={{ height: `${h}%` }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="rounded-[2rem] border-[6px] border-[#0F2A52] bg-white shadow-2xl">
      <div className="rounded-t-[1.6rem] bg-gradient-to-br from-primary-600 to-primary-700 px-4 pb-6 pt-4 text-white">
        <p className="text-[10px] text-white/70">Welcome back</p>
        <p className="text-sm font-bold">Aarav 👋</p>
      </div>
      <div className="-mt-3 grid grid-cols-4 gap-2 rounded-t-2xl bg-white px-3 pb-3 pt-4">
        {['check', 'cap', 'pencil', 'doc', 'calendar', 'rupee', 'book', 'bell'].map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone(['blue', 'green', 'amber', 'rose', 'violet', 'sky', 'teal', 'pink'][i])}`}><Ico name={n} small /></span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 px-3 pb-4">
        <p className="text-[10px] font-bold text-[#0F2A52]">Today&apos;s Classes</p>
        {['Mathematics · 9:00', 'Science · 10:00'].map((c) => (
          <div key={c} className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-1.5"><span className="text-[10px] text-gray-600">{c}</span><span className="rounded bg-primary-600 px-1.5 py-0.5 text-[8px] font-bold text-white">Join</span></div>
        ))}
      </div>
    </div>
  );
}

function Star() {
  return <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 0 0-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 0 0-.363-1.118L2.98 9.384c-.783-.57-.38-1.81.588-1.81h4.161a1 1 0 0 0 .951-.69l1.286-3.957Z" /></svg>;
}

function tone(t) {
  const m = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-emerald-50 text-emerald-600', sky: 'bg-sky-50 text-sky-600',
    indigo: 'bg-indigo-50 text-indigo-600', rose: 'bg-rose-50 text-rose-600', cyan: 'bg-cyan-50 text-cyan-600',
    amber: 'bg-amber-50 text-amber-600', violet: 'bg-violet-50 text-violet-600', orange: 'bg-orange-50 text-orange-600',
    teal: 'bg-teal-50 text-teal-600', pink: 'bg-pink-50 text-pink-600',
  };
  return m[t] || m.blue;
}

function Ico({ name, small }) {
  const cls = small ? 'w-4 h-4' : 'w-6 h-6';
  const paths = {
    users: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
    check: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    rupee: 'M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    cap: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342',
    doc: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
    video: 'm15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z',
    pencil: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10',
    calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    bus: 'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-6m0 0v-9m0 9H3.375A1.125 1.125 0 0 1 2.25 17.625V9.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v8.25',
    book: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
    ticket: 'M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z',
    home: 'm2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    box: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
    cash: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
    bell: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0',
    branch: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
    shield: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
    building: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
    bolt: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
    userplus: 'M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z',
    settings: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.991l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    rocket: 'M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z',
  };
  return <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={paths[name] || paths.check} /></svg>;
}
