'use client';

import Link from 'next/link';
import QuiloLogo from '../QuiloLogo';
import LandingNav from './LandingNav';
import EnquiryForm from './EnquiryForm';
import useReveal from './useReveal';

const FEATURES = [
  { icon: 'users', title: 'Students & Admissions', desc: 'Enrollment, profiles, bulk CSV import, promotions and transfers in a few clicks.' },
  { icon: 'check', title: 'Smart Attendance', desc: 'Class and staff attendance with calendar views, reports and instant parent alerts.' },
  { icon: 'rupee', title: 'Fees & Online Payments', desc: 'Fee structures, invoices, Razorpay collection, defaulter tracking and receipts.' },
  { icon: 'doc', title: 'Exams & Report Cards', desc: 'Marks entry, grading, auto-generated report cards and performance analytics.' },
  { icon: 'calendar', title: 'Timetable & Events', desc: 'Period scheduling, event publishing with ticketing, banners and reminders.' },
  { icon: 'bus', title: 'Transport & Hostel', desc: 'Routes, stops, vehicle docs, student assignment and hostel room allocation.' },
  { icon: 'book', title: 'Library & Inventory', desc: 'Book issue/return, fines, stock categories and transaction history.' },
  { icon: 'bell', title: 'Notifications & Push', desc: 'In-app plus Firebase push to parents and staff — by class, section or everyone.' },
];

const MODULES = [
  'Students', 'Teachers', 'Attendance', 'Fees', 'Exams', 'Timetable',
  'Transport', 'Library', 'Events', 'Hostel', 'Inventory', 'Payroll',
  'Store', 'Banners', 'Notifications', 'Reports',
];

const STATS = [
  { value: '16+', label: 'Integrated Modules' },
  { value: '3', label: 'Apps — Web, Mobile, Admin' },
  { value: '100%', label: 'Multi-Tenant SaaS' },
  { value: '24/7', label: 'Cloud Access' },
];

const WHY = [
  { title: 'Multi-tenant by design', desc: 'One platform, unlimited schools. Each school gets isolated data, branding and settings.' },
  { title: 'Web + Mobile + Admin', desc: 'A student/teacher web portal, native mobile app, and a powerful super-admin panel.' },
  { title: 'Secure OTP login', desc: 'Mobile and email OTP login with per-school toggles, backed by Redis and JWT.' },
  { title: 'Online fee collection', desc: 'Razorpay-powered payments with instant invoices and receipts — zero paperwork.' },
  { title: 'Real-time notifications', desc: 'Firebase push and in-app alerts queued through Redis for reliable delivery.' },
  { title: 'Live in days, not months', desc: 'Self-serve onboarding, bulk imports and sensible defaults get you running fast.' },
];

// Simple per-student pricing billed monthly. Rate drops as the school grows.
const PRICING = [
  {
    name: 'Starter',
    perStudent: '₹10',
    students: 'Up to 500 students',
    priceFrom: '₹15,000',
    features: ['All core modules', 'Web + mobile + admin apps', 'Online fee payments', 'Email support'],
    popular: false,
  },
  {
    name: 'Growth',
    perStudent: '₹13',
    students: '500 – 1,000 students',
    priceFrom: '₹20,000',
    features: ['Everything in Starter', 'Push notifications', 'Reports & analytics', 'Priority support'],
    popular: true,
  },
  {
    name: 'Scale',
    perStudent: '₹20',
    students: '1,000+ students',
    priceFrom: 'Custom',
    features: ['Everything in Growth', 'Custom branding', 'Dedicated account manager', 'Onboarding & training'],
    popular: false,
  },
];

export default function LandingPage() {
  useReveal();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LandingNav />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* animated gradient backdrop */}
        <div className="absolute inset-0 gradient-pan bg-gradient-to-br from-[#0b2a6b] via-[#1746B0] to-[#15A58E]" />
        <div className="absolute inset-0 opacity-20"
             style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* floating blobs */}
        <div className="absolute top-24 -left-20 w-80 h-80 bg-cyan-400/30 blur-3xl animate-blob" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-500/30 blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/15 backdrop-blur rounded-full border border-white/20 animate-fade-in-up">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Complete Education Management Platform
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight animate-fade-in-up">
              Manage Today. <br/><span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">Build Brighter Tomorrows.</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl animate-fade-in-up">
              MyClasses brings admissions, attendance, fees, exams, transport, library and more into a single, beautiful education management platform — with web, mobile and admin apps out of the box.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up">
              <a href="#contact" className="px-7 py-3.5 text-sm font-bold text-primary-700 bg-white rounded-xl shadow-xl hover:-translate-y-0.5 transition-all">
                Request a Free Demo
              </a>
              <Link href="/login" className="px-7 py-3.5 text-sm font-bold text-white bg-white/10 backdrop-blur border border-white/30 rounded-xl hover:bg-white/20 transition-all">
                Sign in to Portal
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-white/70 text-sm animate-fade-in-up">
              <span className="flex items-center gap-2"><Dot /> No setup fees</span>
              <span className="flex items-center gap-2"><Dot /> Cancel anytime</span>
              <span className="flex items-center gap-2"><Dot /> Live in days</span>
            </div>
          </div>

          {/* Hero visual — floating app cards */}
          <div className="relative hidden lg:block h-[460px]">
            <div className="absolute top-0 right-8 w-64 bg-white rounded-2xl shadow-2xl p-5 animate-float">
              <div className="flex items-center gap-3">
                <QuiloLogo size={34} />
                <div>
                  <p className="text-sm font-bold text-gray-900">MyClasses Dashboard</p>
                  <p className="text-xs text-gray-400">Delhi Public School</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {['1,248', '96%', '₹4.2L'].map((v, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-primary-600">{v}</p>
                    <p className="text-[9px] text-gray-400">{['Students', 'Present', 'Collected'][i]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-16 flex items-end gap-1.5">
                {[40, 65, 50, 80, 60, 90, 72].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-primary-500 to-cyan-400 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="absolute top-40 left-0 w-56 bg-white rounded-2xl shadow-2xl p-4 animate-float-slow">
              <p className="text-xs font-bold text-gray-900 mb-3">Today's Attendance</p>
              {['Class 10-A', 'Class 9-B', 'Class 8-C'].map((c, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-gray-500">{c}</span>
                  <span className="text-xs font-semibold text-emerald-600">{[98, 94, 96][i]}%</span>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 right-16 w-52 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-2xl shadow-2xl p-4 text-white animate-float" style={{ animationDelay: '1.5s' }}>
              <p className="text-xs font-medium text-white/80">Fees Collected</p>
              <p className="text-2xl font-extrabold mt-1">₹42,80,000</p>
              <p className="text-[10px] text-white/70 mt-1">↑ 18% this month</p>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 inset-x-0 leading-none">
          <svg viewBox="0 0 1440 80" className="w-full h-16 fill-white" preserveAspectRatio="none"><path d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,80L0,80Z" /></svg>
        </div>
      </section>

      {/* ─── TRUST / STATS ─────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className={`reveal reveal-delay-${i} text-center`}>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto reveal">
            <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">Everything you need</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">One system for the whole school</h2>
            <p className="mt-4 text-gray-600">From the front office to the classroom, MyClasses replaces a dozen disconnected tools with a single source of truth.</p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`reveal reveal-delay-${i % 4} group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MODULES MARQUEE ───────────────────────────────────── */}
      <section id="modules" className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">16+ modules, fully integrated</h2>
          <p className="mt-3 text-gray-600">Every part of your school, talking to every other part.</p>
        </div>
        <div className="mt-10 relative">
          <div className="flex w-max animate-marquee gap-4">
            {[...MODULES, ...MODULES].map((m, i) => (
              <span key={i} className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl whitespace-nowrap">
                {m}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
        </div>
      </section>

      {/* ─── WHY QUILO ─────────────────────────────────────────── */}
      <section id="why" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto reveal">
            <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">Why schools choose us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Built for modern institutions</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w, i) => (
              <div key={w.title} className={`reveal reveal-delay-${i % 3} flex gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm`}>
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{w.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto reveal">
            <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">Simple pricing</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Pay per student. From just &#8377;10/month.</h2>
            <p className="mt-4 text-gray-600">No big upfront cost. You pay a small monthly fee per student, and the rate drops as your school grows. Every plan includes all the apps.</p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {PRICING.map((p, i) => (
              <div key={p.name} className={`reveal reveal-delay-${i} relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${p.popular ? 'border-primary-500 shadow-2xl shadow-primary-500/20 bg-gradient-to-b from-white to-primary-50/50' : 'border-gray-200 shadow-sm bg-white'}`}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold text-white bg-primary-600 rounded-full shadow-lg">Most Popular</span>
                )}
                <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                <p className="mt-1 text-sm font-medium text-gray-500">{p.students}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">{p.perStudent}</span>
                  <span className="text-gray-400 mb-1">/ student / month</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Starting around <span className="font-semibold text-gray-700">{p.priceFrom}</span>{p.priceFrom !== 'Custom' ? '/mo' : ''}
                </p>
                <div className="my-5 h-px bg-gray-100"></div>
                <ul className="space-y-3 flex-1">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`mt-7 text-center px-5 py-3 text-sm font-bold rounded-xl transition-all ${p.popular ? 'text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30' : 'text-primary-700 bg-primary-50 hover:bg-primary-100'}`}>
                  Request a Quote
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 reveal">
            Final price depends on the modules you use. Tell us your student count and needs, and we'll send an exact quote.
          </p>
        </div>
      </section>

      {/* ─── CONTACT / ENQUIRY ─────────────────────────────────── */}
      <section id="contact" className="py-20 bg-gradient-to-br from-[#0b2a6b] via-[#1746B0] to-[#15A58E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 blur-3xl animate-blob" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="text-white reveal">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">Ready to transform your school?</h2>
            <p className="mt-4 text-white/80 text-lg">Request a free, no-obligation demo. See MyClasses running with your school's data in under 15 minutes.</p>
            <div className="mt-8 space-y-4">
              {[
                ['Personalized walkthrough', 'We tailor the demo to your school size and needs.'],
                ['Fast onboarding', 'Bulk import students and staff — go live in days.'],
                ['Dedicated support', 'A real human to help you every step of the way.'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white/15">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-white/70">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-7 sm:p-9 reveal reveal-delay-1">
            <h3 className="text-xl font-bold text-gray-900">Request a Demo</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Fill in your details and we'll be in touch.</p>
            <EnquiryForm source="landing_contact" />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <QuiloLogo size={32} />
              <span className="text-lg font-black"><span className="text-primary-400">My</span><span className="text-white">Classes</span></span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">Education Management Platform — manage today, build brighter tomorrows.</p>
          </div>
          <FooterCol title="Product" links={['Features', 'Modules', 'Pricing', 'Mobile App']} />
          <FooterCol title="Company" links={['About', 'Contact', 'Privacy', 'Terms']} />
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Get in touch</h4>
            <p className="mt-4 text-sm">hello@myclasses.app</p>
            <Link href="/login" className="mt-4 inline-block px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">Sign in to Portal</Link>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 text-sm text-center">
            © {new Date().getFullYear()} MyClasses. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Dot() {
  return <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />;
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

function FeatureIcon({ name }) {
  const paths = {
    users: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
    check: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    rupee: 'M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    doc: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
    calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    bus: 'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-6m0 0v-9m0 9H3.375A1.125 1.125 0 0 1 2.25 17.625V9.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v8.25',
    book: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
    bell: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0',
  };
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name] || paths.check} />
    </svg>
  );
}
