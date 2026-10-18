'use client';

import Link from 'next/link';
import MarketingShell, { PageHero } from '../../components/landing/MarketingShell';
import { features } from '../../lib/siteData';

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="Everything you need"
        title="One platform for the whole school"
        subtitle="From the front office to the classroom, MyClasses replaces a dozen disconnected tools with a single source of truth."
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`reveal reveal-delay-${i % 4} group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{f.description}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {f.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 mt-16 text-center reveal">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">See it running with your school's data</h2>
          <p className="mt-3 text-gray-600">Book a free, personalized demo and we'll walk you through every module.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="px-7 py-3.5 text-sm font-bold text-white bg-primary-600 rounded-xl shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all hover:-translate-y-0.5">Request a Free Demo</Link>
            <Link href="/pricing" className="px-7 py-3.5 text-sm font-bold text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all">View Pricing</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
