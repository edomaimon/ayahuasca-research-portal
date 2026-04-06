import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles, getAllSlugs, getAdjacentArticles } from '@/lib/articles';
import { CATEGORIES } from '@/data/categories';
import VerificationBadge from '@/components/VerificationBadge';
import { LeafDivider } from '@/components/BotanicalElements';
import { generateAuthorSlug } from '@/lib/utils';
import CiteButton from '@/components/CiteButton';
import ShareButtons from '@/components/ShareButtons';
import BackToTop from '@/components/BackToTop';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(slug => ({ slug }));
}

const SITE_URL = 'https://www.ayahuasca-research.com';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  const description = article.abstract
    ? article.abstract.slice(0, 155).replace(/\s+\S*$/, '...')
    : `${article.title} - ${article.journal} (${article.year})`;

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      url: `${SITE_URL}/articles/${slug}`,
      publishedTime: `${article.year}-01-01T00:00:00Z`,
      authors: article.authors,
      tags: article.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const cat = CATEGORIES[article.category] || {};
  const [related, adjacent] = await Promise.all([
    getRelatedArticles(article),
    getAdjacentArticles(article),
  ]);
  const truncatedTitle = article.title.length > 50
    ? article.title.slice(0, 50) + '...'
    : article.title;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    name: article.title,
    headline: article.title,
    abstract: article.abstract || '',
    datePublished: `${article.year}-01-01`,
    author: (article.authors || []).map(name => ({
      '@type': 'Person',
      name,
    })),
    publisher: {
      '@type': 'Organization',
      name: article.journal,
    },
    isAccessibleForFree: article.openAccess || false,
    url: `${SITE_URL}/articles/${article.slug}`,
    ...(article.doi && { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: article.doi } }),
    ...(article.keywords && { keywords: article.keywords.join(', ') }),
  };

  return (
    <div className="article-page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="article-page">
        {/* Breadcrumb */}
        <nav className="article-page__breadcrumb">
          <Link href="/">Home</Link>
          <span className="article-page__breadcrumb-sep"> &rsaquo; </span>
          <span>Articles</span>
          <span className="article-page__breadcrumb-sep"> &rsaquo; </span>
          <span>{truncatedTitle}</span>
        </nav>

        {/* Back link */}
        <Link href="/" className="article-page__back">
          &larr; Back to all articles
        </Link>

        {/* Header */}
        <header>
          <div className="article-page__badges">
            <span className="article-page__category" style={{ color: cat.color }}>
              {article.category}
            </span>
            <VerificationBadge type={article.verification} />
            {article.openAccess && (
              <span className="article-page__open-access">Open Access</span>
            )}
          </div>

          <h1 className="article-page__title">{article.title}</h1>

          {/* Share + Cite row */}
          <div className="article-page__actions">
            <ShareButtons article={article} />
            <CiteButton article={article} />
          </div>

          <p className="article-page__authors">
            {article.authors?.map((author, i) => (
              <span key={author}>
                {i > 0 && ', '}
                <Link
                  href={`/authors/${generateAuthorSlug(author)}`}
                  className="article-page__author-link"
                >
                  {author}
                </Link>
              </span>
            ))}
          </p>

          <p className="article-page__journal">
            {article.journal} ({article.year})
          </p>
        </header>

        <div className="article-page__divider" />

        {/* Study type */}
        {article.studyType && (
          <div className="article-page__study-type">{article.studyType}</div>
        )}

        {/* Abstract */}
        {article.abstract && (
          <div
            className="article-page__abstract"
            style={{ borderLeftColor: cat.color || '#2e7d52' }}
          >
            <div className="article-page__abstract-label">Abstract</div>
            <p>{article.abstract}</p>
          </div>
        )}

        <div className="article-page__divider" />

        {/* Details */}
        <div className="article-page__details">
          {article.participants && (
            <div>
              <span className="article-page__detail-label">Participants</span>
              <span className="article-page__detail-value">
                {article.participants.toLocaleString()}
              </span>
            </div>
          )}
          {article.citations > 0 && (
            <div>
              <span className="article-page__detail-label">Citations</span>
              <span className="article-page__detail-value">
                {article.citations.toLocaleString()}
              </span>
            </div>
          )}
          {article.studyType && (
            <div>
              <span className="article-page__detail-label">Study Type</span>
              <span className="article-page__detail-value" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {article.studyType}
              </span>
            </div>
          )}
        </div>

        {/* Keywords */}
        {article.keywords?.length > 0 && (
          <>
            <div className="article-page__divider" />
            <div className="article-page__keywords">
              {article.keywords.map(k => (
                <Link
                  key={k}
                  href={`/?search=${encodeURIComponent(k)}`}
                  className="article-page__keyword"
                >
                  {k}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* External links */}
        <div className="article-page__links">
          {article.doi && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="article-page__link--primary"
            >
              DOI: {article.doi}
            </a>
          )}
          {article.pmid ? (
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="article-page__link--secondary"
            >
              View on PubMed
            </a>
          ) : article.doi ? (
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(article.doi)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="article-page__link--secondary"
            >
              Search PubMed
            </a>
          ) : null}
        </div>

        {/* Previous / Next navigation */}
        {(adjacent.prev || adjacent.next) && (
          <nav className="article-page__nav">
            {adjacent.prev ? (
              <Link href={`/articles/${adjacent.prev.slug}`} className="article-page__nav-link article-page__nav-link--prev">
                <span className="article-page__nav-label">&larr; Previous</span>
                <span className="article-page__nav-title">{adjacent.prev.title}</span>
              </Link>
            ) : <div />}
            {adjacent.next ? (
              <Link href={`/articles/${adjacent.next.slug}`} className="article-page__nav-link article-page__nav-link--next">
                <span className="article-page__nav-label">Next &rarr;</span>
                <span className="article-page__nav-title">{adjacent.next.title}</span>
              </Link>
            ) : <div />}
          </nav>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="article-page__related">
            <LeafDivider />
            <h2 className="article-page__related-title">Related Articles</h2>
            <div className="article-page__related-grid">
              {related.map(r => {
                const rCat = CATEGORIES[r.category] || {};
                return (
                  <Link
                    key={r.id}
                    href={`/articles/${r.slug}`}
                    className="article-page__related-card"
                  >
                    <div
                      className="article-page__related-accent"
                      style={{ background: rCat.color || '#2e7d52' }}
                    />
                    <span
                      className="article-page__related-category"
                      style={{ color: rCat.color }}
                    >
                      {r.category}
                    </span>
                    <h3>{r.title}</h3>
                    <p>
                      {r.authors?.slice(0, 2).join(', ')}
                      {r.authors?.length > 2 ? ' et al.' : ''}
                    </p>
                    <span className="article-page__related-meta">
                      {r.journal}, {r.year}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>

      <BackToTop />
    </div>
  );
}
