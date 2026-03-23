'use client';

const PAGES_SHOWN = 5;

export default function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  // Build page numbers with ellipsis
  const pages = [];
  if (totalPages <= PAGES_SHOWN + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    const rangeStart = Math.max(2, currentPage - Math.floor(PAGES_SHOWN / 2));
    const rangeEnd = Math.min(totalPages - 1, rangeStart + PAGES_SHOWN - 1);
    if (rangeStart > 2) pages.push('...');
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="pagination">
      <div className="pagination__info">
        Showing {start}&ndash;{end} of {totalItems} articles
      </div>
      <div className="pagination__controls">
        <button
          className="pagination__btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &larr; Previous
        </button>

        <div className="pagination__pages">
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="pagination__ellipsis">&hellip;</span>
            ) : (
              <button
                key={p}
                className={`pagination__page ${p === currentPage ? 'pagination__page--active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          className="pagination__btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
