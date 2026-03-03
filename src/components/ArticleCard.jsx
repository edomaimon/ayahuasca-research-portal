import { CATEGORIES } from '../data/categories';
import VerificationBadge from './VerificationBadge';

// ============================================================
// Article Card Component
// ============================================================

export default function ArticleCard({ article, onClick }) {
  const cat = CATEGORIES[article.category] || {};

  return (
    <div className="article-card" onClick={() => onClick(article)}>
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
        <VerificationBadge type={article.verification} />
      </div>

      <h3 className="article-card__title">{article.title}</h3>

      <div className="article-card__authors">
        {article.authors?.slice(0, 3).join(', ')}
        {article.authors?.length > 3 ? ' et al.' : ''}
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
    </div>
  );
}
