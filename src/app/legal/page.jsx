import Link from 'next/link';
import MarketingShell from '../../components/landing/MarketingShell';
import { LAST_UPDATED, documents, legalPages, company } from '../../lib/legal';

export const metadata = {
  title: 'Legal',
  description: 'MyClasses privacy, terms, cookie, refund, shipping and account deletion policies.',
  alternates: { canonical: '/legal' },
};

export default function LegalIndex() {
  return (
    <MarketingShell>
      <section className="border-b border-gray-200 bg-gradient-to-b from-[#F4F8FE] to-white pt-28 pb-10">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#14213D] sm:text-4xl">Legal &amp; policies</h1>
          <p className="mt-3 max-w-2xl text-[15px] text-gray-600">These policies apply to the {company.brand} website, web portal, Android and iOS apps, and admin panel. Last updated {LAST_UPDATED}.</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-5xl gap-4 px-5 py-12 sm:grid-cols-2 sm:px-8">
        {legalPages.map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md">
            <h2 className="font-bold text-[#14213D] group-hover:text-primary-700">{p.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{documents[p.slug].summary}</p>
          </Link>
        ))}
      </div>
    </MarketingShell>
  );
}
