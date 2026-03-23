export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__accent" />
      <div className="skeleton-card__header">
        <div className="skeleton-card__bar skeleton-card__bar--sm" />
        <div className="skeleton-card__bar skeleton-card__bar--xs" />
      </div>
      <div className="skeleton-card__bar skeleton-card__bar--lg" />
      <div className="skeleton-card__bar skeleton-card__bar--md" />
      <div className="skeleton-card__bar skeleton-card__bar--sm" style={{ marginTop: 'auto' }} />
    </div>
  );
}
