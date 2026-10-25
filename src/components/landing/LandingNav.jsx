'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QuiloLogo from '../QuiloLogo';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Solutions', href: '/#about' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Resources', href: '/#preview' },
  { label: 'About', href: '/about' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300"><QuiloLogo size={38} /></span>
          <span className="text-2xl font-black tracking-tight">
            <span className="text-primary-600">My</span>
            <span className="text-[#0F2A52]">Classes</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-4 py-2 text-[15px] font-semibold rounded-lg transition-all duration-200 group text-gray-700 hover:text-primary-600 hover:bg-primary-50"
            >
              {l.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600">
            Sign in
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all hover:-translate-y-0.5"
          >
            Request Demo
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <svg className="w-6 h-6 text-[#0F2A52]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18 18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'} />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in-up">
          <div className="px-5 py-4 space-y-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg">Sign in</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg">Request Demo</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
