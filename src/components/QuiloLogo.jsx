'use client';

/**
 * Quilo brand mark — gradient "Q" ring (blue→cyan) with a teal swoosh tail.
 * Matches the mobile + admin logo.
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
        <linearGradient id="quiloRingW" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2EA7FF" />
          <stop offset="0.55" stopColor="#1E6FE0" />
          <stop offset="1" stopColor="#1746B0" />
        </linearGradient>
        <linearGradient id="quiloTailW" x1="45" y1="55" x2="80" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2BD4C4" />
          <stop offset="1" stopColor="#15A58E" />
        </linearGradient>
      </defs>
      <circle cx="46" cy="42" r="30" stroke="url(#quiloRingW)" strokeWidth="14" />
      <path d="M50 54 L84 92 L64 92 L40 64 Z" fill="url(#quiloTailW)" />
    </svg>
  );
}
