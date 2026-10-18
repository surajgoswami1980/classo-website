'use client';

import MarketingShell, { PageHero } from '../../components/landing/MarketingShell';
import EnquiryForm from '../../components/landing/EnquiryForm';

const points = [
  ['Personalized walkthrough', 'We tailor the demo to your school size and needs.'],
  ['Fast onboarding', 'Bulk import students and staff — go live in days.'],
  ['Dedicated support', 'A real human to help you every step of the way.'],
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="Get in touch"
        title="Ready to transform your school?"
        subtitle="Request a free, no-obligation demo. See MyClasses running with your school's data in under 15 minutes."
      />

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <div className="reveal">
            <h2 className="text-2xl font-extrabold text-gray-900">Why schools pick MyClasses</h2>
            <div className="mt-6 space-y-4">
              {points.map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t}</p>
                    <p className="text-sm text-gray-500">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                hello@myclasses.app
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-primary-900/10 border border-gray-100 p-7 sm:p-9 reveal reveal-delay-1">
            <h3 className="text-xl font-bold text-gray-900">Request a Demo</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Fill in your details and we'll be in touch shortly.</p>
            <EnquiryForm source="contact_page" />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
