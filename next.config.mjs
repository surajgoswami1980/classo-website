/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7002',
  },
  // Common alternative URLs for the legal pages (app stores, payment gateways, old links).
  async redirects() {
    return [
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/tos', destination: '/terms', permanent: true },
      { source: '/cookie-policy', destination: '/cookies', permanent: true },
      { source: '/refund', destination: '/refund-policy', permanent: true },
      { source: '/cancellation-policy', destination: '/refund-policy', permanent: true },
      { source: '/shipping', destination: '/shipping-policy', permanent: true },
      { source: '/delete-account', destination: '/data-deletion', permanent: true },
      { source: '/account-deletion', destination: '/data-deletion', permanent: true },
    ];
  },
};

export default nextConfig;
