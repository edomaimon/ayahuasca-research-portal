import { getAllArticles, getArticleStats, getStudyTypes, getUniqueAuthorsCount } from '@/lib/articles';
import { CATEGORIES } from '@/data/categories';
import HomePage from '@/components/HomePage';

export const revalidate = 3600; // revalidate every hour

const SITE_URL = 'https://www.ayahuasca-research.com';

export default async function Page({ searchParams }) {
  const [articles, stats, studyTypes, uniqueAuthors] = await Promise.all([
    getAllArticles(),
    getArticleStats(),
    getStudyTypes(),
    getUniqueAuthorsCount(),
  ]);

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
        uniqueAuthors={uniqueAuthors}
      />
    </>
  );
}
