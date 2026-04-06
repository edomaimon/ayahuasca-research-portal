export default function StatsBar({ stats, uniqueAuthors }) {
  if (!stats) return null;

  const items = [
    { value: stats.total, label: 'Articles' },
    { value: stats.yearRange, label: 'Year Range' },
    { value: stats.journals, label: 'Journals' },
    { value: uniqueAuthors, label: 'Authors' },
  ];

  return (
    <div className="stats-bar">
      <div className="stats-bar__inner">
        {items.map(item => (
          <div key={item.label} className="stats-bar__item">
            <span className="stats-bar__value">{item.value}</span>
            <span className="stats-bar__label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
