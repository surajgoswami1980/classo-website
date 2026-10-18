import './globals.css';
import { Providers } from '../providers/Providers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myclasses.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MyClasses — Complete Education Management Platform',
    template: '%s | MyClasses',
  },
  description:
    'MyClasses is a complete education management platform for schools and institutes — admissions, attendance, fees, exams, timetable, transport, library, payroll and more, with web, mobile and admin apps. Pay per student from ₹10/month. Request a free demo.',
  applicationName: 'MyClasses',
  keywords: [
    'school ERP', 'school management software', 'school management system',
    'student information system', 'MyClasses', 'education management platform',
    'online fee payment', 'attendance management', 'school admin software',
    'school app', 'coaching institute software', 'per student pricing',
  ],
  authors: [{ name: 'MyClasses' }],
  creator: 'MyClasses',
  publisher: 'MyClasses',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'MyClasses',
    title: 'MyClasses — Complete Education Management Platform',
    description:
      'Run your entire school on one platform. Admissions, attendance, fees, exams, transport, library and more — web, mobile and admin apps. Pay per student from ₹10/month.',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyClasses — Complete Education Management Platform',
    description:
      'Run your entire school on one platform. Pay per student from ₹10/month. Request a free demo.',
  },
  icons: { icon: '/favicon.ico' },
  category: 'education',
};

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

// Structured data (JSON-LD) for rich search results.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MyClasses',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Android, iOS',
  description:
    'Complete education management platform for schools and institutes — admissions, attendance, fees, exams, transport, library, payroll and more.',
  offers: {
    '@type': 'Offer',
    price: '10',
    priceCurrency: 'INR',
    description: 'Per student, per month. Billed monthly.',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '120',
  },
  publisher: { '@type': 'Organization', name: 'MyClasses', slogan: 'Manage Today. Build Brighter Tomorrows.' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
