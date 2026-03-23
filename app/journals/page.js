import Link from 'next/link';
import { VERIFIED_ARTICLES } from '@/data/articles';
import { LeafDivider } from '@/components/BotanicalElements';

const SITE_URL = 'https://www.ayahuasca-research.com';

export const metadata = {
  title: 'Journals',
  description: 'Browse all journals in the Ayahuasca Research Portal database, sorted by article count.',
  alternates: { canonical: '/journals' },
};

function getJournals() {
  const map = {};
  VERIFIED_ARTICLES.forEach(a => {
    if (!map[a.journal]) map[a.journal] = { name: a.journal, count: 0, years: [] };
    map[a.journal].count++;
    map[a.journal].years.push(a.year);
  });
  return Object.values(map)
    .map(j => ({
      ...j,
      yearRange: `${Math.min(...j.years)}-${Math.max(...j.years)}`,
    }))
    .sort((a, b) => b.count - a.count);
}

export default function JournalsPage() {
  const journals = getJournals();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Journals — Ayahuasca Research Portal',
    url: `${SITE_URL}/journals`,
    description: `Browse ${journals.length} journals with published ayahuasca research.`,
  };

  return (
    <div className="journals-page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="journals-page">
        {/* Breadcrumb */}
        <nav className="article-page__breadcrumb">
          <Link href="/">Home</Link>
          <span className="article-page__breadcrumb-sep"> &rsaquo; </span>
          <span>Journals</span>
        </nav>

        <Link href="/" className="article-page__back">
          &larr; Back to all articles
        </Link>

        <h1 className="journals-page__title">Journals</h1>
        <p className="journals-page__subtitle">
          {journals.length} journals with published ayahuasca research
        </p>

        <LeafDivider />

        <div className="journals-page__list">
          {journals.map(j => (
            <Link
              key={j.name}
              href={`/?search=${encodeURIComponent(j.name)}`}
              className="journals-page__item"
            >
              <div className="journals-page__item-main">
                <span className="journals-page__item-name">{j.name}</span>
                <span className="journals-page__item-years">{j.yearRange}</span>
              </div>
              <span className="journals-page__item-count">
                {j.count} article{j.count !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
