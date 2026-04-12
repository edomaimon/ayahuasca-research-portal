'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import VerificationBadge from './VerificationBadge';
import HighlightedText from './HighlightedText';

function isNew(createdAt) {
  if (!createdAt) return false;
  const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
  return new Date(createdAt).getTime() > fifteenDaysAgo;
}

export default function ArticleCard({ article, searchQuery }) {
  const cat = CATEGORIES[article.category] || {};
  const authorsText = (article.authors?.slice(0, 3).join(', ') || '') +
    (article.authors?.length > 3 ? ' et al.' : '');
  const recentlyAdded = isNew(article.createdAt);

  return (
    <Link href={`/articles/${article.slug}`} className="article-card">
      {/* Left accent bar */}
      <div
        className="article-card__accent"
        style={{ background: cat.color || '#2e7d52' }}
      />

      <div className="article-card__header">
        <span
          className="article-card__category"
          style={{ color: cat.color }}
        >
          {article.category}
        </span>
        <div className="article-card__header-right">
          {recentlyAdded && <span className="article-card__new-badge">New</span>}
          <VerificationBadge type={article.verification} />
        </div>
      </div>

      <h3 className="article-card__title">
        <HighlightedText text={article.title} query={searchQuery} />
      </h3>

      <div className="article-card__authors">
        <HighlightedText text={authorsText} query={searchQuery} />
      </div>

      <div className="article-card__meta">
        <span className="article-card__journal">
          {article.journal}, {article.year}
        </span>
        <div className="article-card__stats">
          {article.citations > 0 && <span>{article.citations} citations</span>}
          {article.openAccess && (
            <span className="article-card__open-access">Open Access</span>
          )}
        </div>
      </div>

      {article.studyType && (
        <span className="article-card__study-type">{article.studyType}</span>
      )}
    </Link>
  );
}
