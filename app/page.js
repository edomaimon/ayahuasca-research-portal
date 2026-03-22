import { VERIFIED_ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import HomePage from '@/components/HomePage';

const SITE_URL = 'https://www.ayahuasca-research.com';

function getStats() {
  const articles = VERIFIED_ARTICLES;
  return {
    total: articles.length,
    openAccess: articles.filter((a) => a.openAccess).length,
    totalCitations: articles.reduce((sum, a) => sum + (a.citations || 0), 0),
    journals: new Set(articles.map((a) => a.journal)).size,
    yearRange: `${Math.min(...articles.map((a) => a.year))}-${Math.max(...articles.map((a) => a.year))}`,
    pubmedVerified: articles.filter((a) => a.verification?.startsWith('PubMed')).length,
    categories: Object.keys(CATEGORIES).map((cat) => ({
      name: cat,
      count: articles.filter((a) => a.category === cat).length,
      ...CATEGORIES[cat],
    })),
  };
}

function getStudyTypes() {
  const counts = {};
  VERIFIED_ARTICLES.forEach((a) => {
    if (a.studyType) counts[a.studyType] = (counts[a.studyType] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export default function Page({ searchParams }) {
  const stats = getStats();
  const studyTypes = getStudyTypes();
  const articles = VERIFIED_ARTICLES;
  const initialSearch = searchParams?.search || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ayahuasca Research Portal',
    url: SITE_URL,
    description: 'A curated database of verified peer-reviewed articles and academic books on ayahuasca research.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage
        key={initialSearch}
        articles={articles}
        stats={stats}
        studyTypes={studyTypes}
        initialSearch={initialSearch}
      />
    </>
  );
}
