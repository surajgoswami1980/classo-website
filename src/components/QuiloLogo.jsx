'use client';

/**
 * MyClasses brand mark. Renders the real logo from /public/myclasses-logo.svg
 * (a square 1024×1024 mark). Keeps the same { size, className } API so every
 * existing usage works unchanged. Falls back to the raster logo if the SVG
 * fails to load.
 */
export default function QuiloLogo({ size = 40, className = '' }) {
  return (
    <img
      src="/myclasses-logo.svg"
      alt="MyClasses"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      onError={(e) => {
        if (e.currentTarget.src.indexOf('myclassi.jpg') === -1) e.currentTarget.src = '/myclassi.jpg';
      }}
    />
  );
}
