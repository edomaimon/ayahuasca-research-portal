// ============================================================
// Category Pill Filter Component
// ============================================================

export default function CategoryPill({ name, color, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`category-pill ${active ? 'category-pill--active' : 'category-pill--inactive'}`}
      style={active ? { background: color, borderColor: color } : undefined}
    >
      {name}
      <span className="category-pill__count">({count})</span>
    </button>
  );
}
