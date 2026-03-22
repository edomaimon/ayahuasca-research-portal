import { ImageResponse } from '@vercel/og';
import { VERIFIED_ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';

export const runtime = 'edge';
export const alt = 'Article preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { slug } = params;
  const article = VERIFIED_ARTICLES.find(a => a.slug === slug);
  if (!article) {
    return new ImageResponse(
      <div style={{ display: 'flex', background: '#1a2a1c', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32 }}>
        Article Not Found
      </div>,
      { ...size }
    );
  }

  const cat = CATEGORIES[article.category] || {};
  const accentColor = cat.color || '#2e7d52';
  const authorsText = article.authors?.length > 3
    ? article.authors.slice(0, 3).join(', ') + ' et al.'
    : article.authors?.join(', ') || '';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a2a1c',
        padding: 0,
      }}
    >
      {/* Accent bar at top */}
      <div style={{ display: 'flex', height: 6, width: '100%', backgroundColor: accentColor }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '48px 60px 40px',
          justifyContent: 'space-between',
        }}
      >
        {/* Top section */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Category */}
          <div
            style={{
              display: 'flex',
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: accentColor,
              marginBottom: 20,
            }}
          >
            {article.category}
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: article.title.length > 100 ? 30 : 36,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.3,
              maxHeight: 200,
              overflow: 'hidden',
            }}
          >
            {article.title}
          </div>

          {/* Authors */}
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 20,
              fontStyle: 'italic',
            }}
          >
            {authorsText}
          </div>

          {/* Journal & Year */}
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 8,
              fontWeight: 600,
            }}
          >
            {article.journal} ({article.year})
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 16,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.08em',
            }}
          >
            Ayahuasca Research Portal
          </div>
          {article.openAccess && (
            <div
              style={{
                display: 'flex',
                fontSize: 13,
                color: '#2e7d52',
                backgroundColor: 'rgba(46,125,82,0.15)',
                padding: '4px 12px',
                borderRadius: 4,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Open Access
            </div>
          )}
        </div>
      </div>
    </div>,
    { ...size }
  );
}
