'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'mc.cookie-notice';

/**
 * We only use strictly necessary storage (sign-in, security, preferences),
 * so this is an informational notice. There are no tracking cookies to opt out of.
 * If analytics are ever added, turn this into an accept/reject consent banner.
 */
export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { setShow(!localStorage.getItem(KEY)); } catch { /* storage blocked: stay hidden */ }
  }, []);

  if (!show) return null;
  const dismiss = () => { try { localStorage.setItem(KEY, new Date().toISOString()); } catch {} setShow(false); };

  return (
    <div role="region" aria-label="Cookie notice" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:inset-x-6 sm:flex sm:items-center sm:gap-4 sm:p-5">
      <p className="text-sm leading-relaxed text-gray-600">
        We use only essential cookies and local storage to keep you signed in, protect forms and remember your preferences. We don&apos;t use advertising or tracking cookies.{' '}
        <Link href="/cookies" className="font-semibold text-primary-700 hover:underline">Cookie Policy</Link>
      </p>
      <button type="button" onClick={dismiss} className="mt-3 w-full shrink-0 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 sm:mt-0 sm:w-auto">
        Got it
      </button>
    </div>
  );
}
