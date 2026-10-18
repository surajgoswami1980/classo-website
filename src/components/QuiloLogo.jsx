'use client';

/**
 * MyClasses brand mark — an "M" (blue→cyan gradient) with a graduation cap on
 * top and open-book pages in the centre valley. Matches the admin + mobile logo.
 */
export default function QuiloLogo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="mcMarkW" x1="12" y1="20" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="0.55" stopColor="#1E90FF" />
          <stop offset="1" stopColor="#06D6C4" />
        </linearGradient>
        <linearGradient id="mcCapW" x1="28" y1="12" x2="72" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E63E6" />
          <stop offset="1" stopColor="#0FB5D6" />
        </linearGradient>
      </defs>
      {/* The M */}
      <path d="M20 82 L20 48 L50 72 L80 48 L80 82" stroke="url(#mcMarkW)" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Open book pages */}
      <path d="M50 70 L34 60 L34 52 L50 61 L66 52 L66 60 Z" fill="#DBEAFE" />
      {/* Graduation cap */}
      <path d="M50 15 L73 25 L50 35 L27 25 Z" fill="url(#mcCapW)" />
      <path d="M39 31 L39 39 Q50 45 61 39 L61 31" fill="#1E3A8A" />
      <path d="M72 25 L72 35" stroke="#0FB5D6" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="72" cy="37.5" r="2.8" fill="#06D6C4" />
    </svg>
  );
}
