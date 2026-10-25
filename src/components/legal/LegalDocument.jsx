import Link from 'next/link';
import MarketingShell from '../landing/MarketingShell';
import { LAST_UPDATED, company, legalPages } from '../../lib/legal';

/**
 * Shared layout for every legal page: title band, "on this page" contents,
 * readable body and links to the other policies. Server-rendered, so the
 * text is in the HTML for app store reviewers and search engines.
 */
export default function LegalDocument({ slug, doc, children }) {
  return (
    <MarketingShell>
      <section className="border-b border-gray-200 bg-gradient-to-b from-[#F4F8FE] to-white pt-28 pb-10">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-1.5 text-gray-300">/</span>
            <Link href="/legal" className="hover:text-primary-600">Legal</Link>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#14213D] sm:text-4xl">{doc.title}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">{doc.summary}</p>
          <p className="mt-4 text-xs font-medium text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">On this page</p>
          <ul className="mt-3 space-y-1.5 border-l border-gray-200">
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent pl-3 text-sm text-gray-600 hover:border-primary-500 hover:text-primary-700">
                  {s.heading.replace(/^\d+\.\s*/, '')}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Other policies</p>
          <ul className="mt-3 space-y-1.5">
            {legalPages.filter((p) => p.slug !== slug).map((p) => (
              <li key={p.slug}><Link href={`/${p.slug}`} className="text-sm text-gray-600 hover:text-primary-700">{p.title}</Link></li>
            ))}
          </ul>
        </aside>

        <article className="min-w-0 text-[15px] leading-7 text-gray-700">
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-gray-100 pb-8 pt-2 last:border-0 [&+section]:mt-6">
              <h2 className="text-lg font-bold text-[#14213D]">{s.heading}</h2>
              <div className="mt-3 space-y-4">
                {s.body.map((b, i) => <Block key={i} b={b} />)}
              </div>
            </section>
          ))}
          {children}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-[#F4F8FE] p-5 text-sm text-gray-600">
            Questions about this policy? Email{' '}
            <a href={`mailto:${company.privacyEmail}`} className="font-semibold text-primary-700 hover:underline">{company.privacyEmail}</a>
            {company.phone ? <> or call <span className="font-semibold text-gray-800">{company.phone}</span></> : null}.
          </div>
        </article>
      </div>
    </MarketingShell>
  );
}

function Block({ b }) {
  if (typeof b === 'string') return <p>{b}</p>;
  if (b.list) {
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-primary-500">
        {b.list.map((li, i) => <li key={i}>{li}</li>)}
      </ul>
    );
  }
  if (b.table) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>{b.table.head.map((h) => <th key={h} scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {b.table.rows.map((r, i) => (
              <tr key={i} className="align-top">{r.map((cell, j) => <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}
