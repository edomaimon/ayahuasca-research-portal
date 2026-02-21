import { useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { BotanicalCorner } from './BotanicalElements';
import VerificationBadge from './VerificationBadge';

// ============================================================
// Article Detail Modal Component
// ============================================================

export default function ArticleDetail({ article, onClose }) {
  if (!article) return null;
  const cat = CATEGORIES[article.category] || {};

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop" />
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <BotanicalCorner
          style={{ position: 'absolute', top: 8, right: 8, transform: 'rotate(90deg)' }}
        />

        <button className="modal-close" onClick={onClose}>
          X
        </button>

        {/* Tags */}
        <div className="modal__tags">
          <span className="modal__category-label" style={{ color: cat.color }}>
            {article.category}
          </span>
          <VerificationBadge type={article.verification} />
          {article.openAccess && (
            <span className="modal__open-access-badge">Open Access</span>
          )}
        </div>

        {/* Title */}
        <h2 className="modal__title">{article.title}</h2>

        {/* Authors */}
        <p className="modal__authors">{article.authors?.join(', ')}</p>

        {/* Journal */}
        <p className="modal__journal">
          {article.journal} ({article.year})
        </p>

        {/* Abstract */}
        {article.abstract && (
          <div
            className="modal__abstract"
            style={{ borderLeftColor: cat.color || '#2e7d52' }}
          >
            <div className="modal__abstract-label">Abstract</div>
            <p className="modal__abstract-text">{article.abstract}</p>
          </div>
        )}

        {/* Details Row */}
        <div className="modal__details">
          {article.participants && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
              <span className="modal__detail-label">Participants</span>
              <span className="modal__detail-value">
                {article.participants.toLocaleString()}
              </span>
            </div>
          )}
          {article.citations > 0 && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
              <span className="modal__detail-label">Citations</span>
              <span className="modal__detail-value">
                {article.citations.toLocaleString()}
              </span>
            </div>
          )}
          {article.studyType && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
              <span className="modal__detail-label">Study Type</span>
              <span className="modal__detail-value modal__detail-value--sm">
                {article.studyType}
              </span>
            </div>
          )}
        </div>

        {/* Keywords */}
        {article.keywords && (
          <div className="modal__keywords">
            {article.keywords.map((k) => (
              <span key={k} className="modal__keyword">{k}</span>
            ))}
          </div>
        )}

        {/* External Links */}
        <div className="modal__links">
          {article.pmid && (
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="modal__link--primary"
            >
              View on PubMed
            </a>
          )}
          {article.doi && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="modal__link--secondary"
            >
              DOI Link
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
