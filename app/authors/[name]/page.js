import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllArticles } from '@/lib/articles';
import { CATEGORIES } from '@/data/categories';
import { generateAuthorSlug } from '@/lib/utils';
import { LeafDivider } from '@/components/BotanicalElements';

const SITE_URL = 'https://www.ayahuasca-research.com';

async function getAllAuthors() {
  const articles = await getAllArticles();
  const map = {};
  articles.forEach(a => {
    (a.authors || []).forEach(name => {
      const slug = generateAuthorSlug(name);
      if (!map[slug]) map[slug] = { name, slug, articles: [] };
      map[slug].articles.push(a);
    });
  });
  return map;
}

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return Object.keys(authors).map(name => ({ name }));
}

export async function generateMetadata({ params }) {
  const authors = await getAllAuthors();
  const author = authors[params.name];
  if (!author) return { title: 'Author Not Found' };

  return {
    title: `${author.name} — Research Articles`,
    description: `${author.articles.length} peer-reviewed ayahuasca research articles by ${author.name}.`,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      title: `${author.name} — Ayahuasca Research`,
      description: `Browse ${author.articles.length} verified articles by ${author.name}.`,
    },
  };
}

export default async function AuthorPage({ params }) {
  const authors = await getAllAuthors();
  const author = authors[params.name];
  if (!author) notFound();

  // Group articles by year, newest first
  const byYear = {};
  author.articles.forEach(a => {
    (byYear[a.year] ||= []).push(a);
  });
  const years = Object.keys(byYear).sort((a, b) => b - a);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${SITE_URL}/authors/${author.slug}`,
    sameAs: [],
    knowsAbout: 'Ayahuasca research',
  };

  return (
    <div className="author-page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="author-page">
        {/* Breadcrumb */}
        <nav className="article-page__breadcrumb">
          <Link href="/">Home</Link>
          <span className="article-page__breadcrumb-sep"> &rsaquo; </span>
          <span>Authors</span>
          <span className="article-page__breadcrumb-sep"> &rsaquo; </span>
          <span>{author.name}</span>
        </nav>

        <Link href="/" className="article-page__back">
          &larr; Back to all articles
        </Link>

        <h1 className="author-page__name">{author.name}</h1>
        <p className="author-page__count">
          {author.articles.length} article{author.articles.length !== 1 ? 's' : ''} in the database
        </p>

        <LeafDivider />

        {years.map(year => (
          <section key={year} className="author-page__year-group">
            <h2 className="author-page__year">{year}</h2>
            <div className="author-page__articles">
              {byYear[year].map(article => {
                const cat = CATEGORIES[article.category] || {};
                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="article-page__related-card"
                  >
                    <div
                      className="article-page__related-accent"
                      style={{ background: cat.color || '#2e7d52' }}
                    />
                    <span
                      className="article-page__related-category"
                      style={{ color: cat.color }}
                    >
                      {article.category}
                    </span>
                    <h3>{article.title}</h3>
                    <p>
                      {article.authors?.slice(0, 3).join(', ')}
                      {article.authors?.length > 3 ? ' et al.' : ''}
                    </p>
                    <div className="article-page__related-meta">
                      <span>{article.journal}</span>
                      {article.citations > 0 && (
                        <span> &middot; {article.citations} citations</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
