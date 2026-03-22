import { ImageResponse } from '@vercel/og';
import { VERIFIED_ARTICLES } from '@/data/articles';

export const runtime = 'edge';
export const alt = 'Ayahuasca Research Portal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const total = VERIFIED_ARTICLES.length;
  const years = VERIFIED_ARTICLES.map(a => a.year);
  const yearRange = `${Math.min(...years)}-${Math.max(...years)}`;

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
      <div style={{ display: 'flex', height: 6, width: '100%', background: 'linear-gradient(90deg, #2e7d52, #6b5ca5, #2a7a6b, #a0722a)' }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '60px 70px 50px',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              fontSize: 15,
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 24,
            }}
          >
            Peer-Reviewed Scientific Literature Database
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: 56,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Ayahuasca Research Portal
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              width: 80,
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.25)',
              margin: '20px 0',
            }}
          />

          {/* Description */}
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 32,
            }}
          >
            Verified Peer-Reviewed Research
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 42, fontWeight: 700, color: '#fff' }}>
                {total}
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Articles
              </div>
            </div>
            <div style={{ display: 'flex', width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 42, fontWeight: 700, color: '#fff' }}>
                {yearRange}
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Year Range
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            fontSize: 14,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.06em',
          }}
        >
          ayahuasca-research.com
        </div>
      </div>
    </div>,
    { ...size }
  );
}
