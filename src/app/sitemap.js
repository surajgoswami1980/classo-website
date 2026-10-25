import { legalPages } from '../lib/legal';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myclasses.app';

export default function sitemap() {
  const now = new Date();
  const page = (path, priority, changeFrequency = 'monthly') => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page('/', 1, 'weekly'),
    page('/features', 0.8),
    page('/pricing', 0.8),
    page('/about', 0.6),
    page('/contact', 0.7),
    page('/login', 0.5),
    page('/legal', 0.4, 'yearly'),
    ...legalPages.map((p) => page(`/${p.slug}`, 0.4, 'yearly')),
  ];
}
