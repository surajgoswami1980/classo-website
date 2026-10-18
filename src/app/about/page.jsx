'use client';

import Link from 'next/link';
import MarketingShell, { PageHero } from '../../components/landing/MarketingShell';
import { stats, testimonials } from '../../lib/siteData';

const values = [
  { title: 'Built for Indian schools', desc: 'CBSE, ICSE and State Board patterns, rupee-first fees, and workflows that match how schools here actually run.' },
  { title: 'One platform, not ten tools', desc: 'Admissions, attendance, fees, exams, transport, library and more — all talking to each other.' },
  { title: 'Live in days, not months', desc: 'Self-serve onboarding, bulk CSV imports and sensible defaults get you running fast.' },
  { title: 'Honest, simple pricing', desc: 'Pay per student. The rate drops as you grow. No lock-in, no surprise fees.' },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="About MyClasses"
        title="Manage Today. Build Brighter Tomorrows."
        subtitle="MyClasses is a complete education management platform helping schools go fully digital — with web, mobile and admin apps out of the box."
      />

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center reveal">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Our mission</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Running a school means juggling admissions, attendance, fees, exams, staff, transport and parent communication — often across spreadsheets and disconnected apps. We built MyClasses to bring all of it into one beautiful, reliable system so educators can spend less time on paperwork and more time on students.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className={`reveal reveal-delay-${i} text-center`}>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto reveal">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">What we stand for</h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={v.title} className={`reveal reveal-delay-${i % 2} flex gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm`}>
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{v.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto reveal">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Loved by schools</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`reveal reveal-delay-${i} bg-white rounded-2xl border border-gray-100 shadow-sm p-6`}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <svg key={k} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 0 0-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 0 0-.363-1.118L2.98 9.384c-.783-.57-.38-1.81.588-1.81h4.161a1 1 0 0 0 .951-.69l1.286-3.957Z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.school}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center reveal">
            <Link href="/contact" className="px-7 py-3.5 text-sm font-bold text-white bg-primary-600 rounded-xl shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all hover:-translate-y-0.5">Request a Free Demo</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
