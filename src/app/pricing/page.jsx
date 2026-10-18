'use client';

import Link from 'next/link';
import { useState } from 'react';
import MarketingShell, { PageHero } from '../../components/landing/MarketingShell';
import { pricingPlans, addons, faqs } from '../../lib/siteData';

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <MarketingShell>
      <PageHero
        badge="Simple pricing"
        title="Pay per student. From just ₹10/month."
        subtitle="No big upfront cost. You pay a small monthly fee per student, and the rate drops as your school grows. Every plan includes all the apps."
      />

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-3 gap-6 items-stretch">
          {pricingPlans.map((p, i) => (
            <div key={p.name} className={`reveal reveal-delay-${i} relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${p.popular ? 'border-primary-500 shadow-2xl shadow-primary-500/20 bg-gradient-to-b from-white to-primary-50/50' : 'border-gray-200 shadow-sm bg-white'}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold text-white bg-primary-600 rounded-full shadow-lg">Most Popular</span>
              )}
              <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{p.studentLimit}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">₹{p.perStudent}</span>
                <span className="text-gray-400 mb-1">/ student / month</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Starting around <span className="font-semibold text-gray-700">{p.fromPrice}</span>{p.fromPrice !== 'Custom' ? '/mo' : ''}</p>
              <p className="mt-3 text-sm text-gray-500">{p.description}</p>
              <div className="my-5 h-px bg-gray-100" />
              <ul className="space-y-3 flex-1">
                {p.features.map((feat) => (
                  <li key={feat} className={`flex items-center gap-2 text-sm ${feat.endsWith(':') ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                    {!feat.endsWith(':') && <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`mt-7 text-center px-5 py-3 text-sm font-bold rounded-xl transition-all ${p.popular ? 'text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30' : 'text-primary-700 bg-primary-50 hover:bg-primary-100'}`}>
                Request a Quote
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500 reveal">
          Final price depends on the modules you use. Tell us your student count and needs, and we'll send an exact quote.
        </p>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto reveal">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Optional add-ons</h2>
            <p className="mt-3 text-gray-600">Extend your plan whenever you need more.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {addons.map((a, i) => (
              <div key={a.name} className={`reveal reveal-delay-${i % 4} bg-white rounded-2xl border border-gray-100 p-6 shadow-sm`}>
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{a.type}</p>
                <h3 className="mt-2 text-base font-bold text-gray-900">{a.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{a.description}</p>
                <p className="mt-4 text-xl font-extrabold text-gray-900">{a.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center reveal">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <div key={f.question} className="reveal border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900">{f.question}</span>
                  <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed animate-fade-in-up">{f.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
