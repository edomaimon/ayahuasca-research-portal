// ============================================================
// Verification Badge Component
// ============================================================

const BADGE_CONFIG = {
  PubMed: { className: 'verification-badge--pubmed', label: 'PubMed Verified' },
  DOI: { className: 'verification-badge--doi', label: 'DOI Resolved' },
  Publisher: { className: 'verification-badge--publisher', label: 'Publisher Confirmed' },
};

export default function VerificationBadge({ type }) {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.DOI;
  return (
    <span className={`verification-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
