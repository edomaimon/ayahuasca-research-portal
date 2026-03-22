import { VERIFIED_ARTICLES } from '@/data/articles';

const SITE_URL = 'https://www.ayahuasca-research.com';

export default function sitemap() {
  const articleUrls = VERIFIED_ARTICLES.map(article => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...articleUrls,
  ];
}
