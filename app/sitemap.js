import { VERIFIED_ARTICLES } from '@/data/articles';
import { generateAuthorSlug } from '@/lib/utils';

const SITE_URL = 'https://www.ayahuasca-research.com';

export default function sitemap() {
  const articleUrls = VERIFIED_ARTICLES.map(article => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Unique author slugs
  const authorSlugs = new Set();
  VERIFIED_ARTICLES.forEach(a => {
    (a.authors || []).forEach(name => authorSlugs.add(generateAuthorSlug(name)));
  });
  const authorUrls = [...authorSlugs].map(slug => ({
    url: `${SITE_URL}/authors/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/journals`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...articleUrls,
    ...authorUrls,
  ];
}
