const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myclasses.app';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep private portal routes out of search results.
        disallow: ['/dashboard', '/profile', '/fees', '/attendance', '/exam', '/notifications'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
