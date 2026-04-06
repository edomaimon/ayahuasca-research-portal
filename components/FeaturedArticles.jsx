import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';

export default function FeaturedArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="featured">
      <div className="featured__inner">
        <div className="featured__header">
          <span className="featured__label">Featured Research</span>
          <h2 className="featured__title">Landmark Studies</h2>
        </div>
        <div className="featured__scroll">
          {articles.map(article => {
            const cat = CATEGORIES[article.category] || {};
            const excerpt = article.abstract
              ? article.abstract.slice(0, 120).replace(/\s+\S*$/, '...')
              : '';

            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="featured__card"
              >
                <div
                  className="featured__card-accent"
                  style={{ background: cat.color || '#a0722a' }}
                />
                <span
                  className="featured__card-category"
                  style={{ color: cat.color }}
                >
                  {article.category}
                </span>
                <h3 className="featured__card-title">{article.title}</h3>
                <p className="featured__card-authors">
                  {article.authors?.slice(0, 3).join(', ')}
                  {article.authors?.length > 3 ? ' et al.' : ''}
                </p>
                <span className="featured__card-year">{article.journal}, {article.year}</span>
                {excerpt && (
                  <p className="featured__card-excerpt">{excerpt}</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
