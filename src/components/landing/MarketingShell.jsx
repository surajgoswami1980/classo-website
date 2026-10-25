'use client';

import Link from 'next/link';
import LandingNav from './LandingNav';
import QuiloLogo from '../QuiloLogo';
import useReveal from './useReveal';
import CookieNotice from '../legal/CookieNotice';
import { legalPages } from '../../lib/legal';

/**
 * Shared marketing-page shell: fixed MyClasses navbar + footer, with the
 * reveal-on-scroll observer wired up. Wrap each marketing page's content.
 */
export default function MarketingShell({ children }) {
  useReveal();
  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <LandingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}

export function MarketingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <QuiloLogo size={32} />
            <span className="text-lg font-black"><span className="text-primary-400">My</span><span className="text-white">Classes</span></span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">Education Management Platform — manage today, build brighter tomorrows.</p>
        </div>
        <FooterCol title="Product" links={[['Features', '/features'], ['Pricing', '/pricing'], ['About', '/about'], ['Contact', '/contact']]} />
        <FooterCol title="Legal" links={[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund Policy', '/refund-policy'], ['Delete Account', '/data-deletion']]} />
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Get in touch</h4>
          <p className="mt-4 text-sm">info@myclasses.in or 8295150083</p>
          <Link href="/login" className="mt-4 inline-block px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">Sign in to Portal</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 px-5 py-5 text-sm sm:flex-row sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} MyClasses. All rights reserved.</span>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
            {legalPages.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="hover:text-white transition-colors">{p.short}</Link>
            ))}
          </nav>
        </div>
      </div>
      <CookieNotice />
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}><Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

/** Page hero band used across marketing sub-pages. */
export function PageHero({ badge, title, subtitle }) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 gradient-pan bg-gradient-to-br from-[#0b2a6b] via-[#1746B0] to-[#15A58E]" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-400/20 blur-3xl animate-blob" />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center text-white">
        {badge && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/15 backdrop-blur rounded-full border border-white/20">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            {badge}
          </span>
        )}
        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
      <div className="absolute bottom-0 inset-x-0 leading-none">
        <svg viewBox="0 0 1440 80" className="w-full h-14 fill-white" preserveAspectRatio="none"><path d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,80L0,80Z" /></svg>
      </div>
    </section>
  );
}
