import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // Fetch current stats
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    let total = 150;
    let yearRange = '1972-2026';
    
    try {
      const statsRes = await fetch(`${baseUrl}/stats.json`);
      if (statsRes.ok) {
        const stats = await statsRes.json();
        total = stats.total || total;
        yearRange = stats.yearRange || yearRange;
      }
    } catch (e) {
      // Use defaults if fetch fails
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #0a1f0e 0%, #132b15 40%, #1a3a1c 70%, #0d2410 100%)',
            fontFamily: 'Georgia, serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative leaf patterns */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '-40px',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34,85,34,0.3) 0%, transparent 70%)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              right: '-60px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34,85,34,0.25) 0%, transparent 70%)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '100px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(45,100,45,0.15) 0%, transparent 70%)',
              display: 'flex',
            }}
          />

          {/* Top label */}
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            Peer-Reviewed Scientific Literature Database
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              textAlign: 'center',
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>Ayahuasca</span>
            <span>Research Portal</span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: '80px',
              height: '1px',
              background: 'rgba(255,255,255,0.25)',
              margin: '20px 0',
              display: 'flex',
            }}
          />

          {/* Article count */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#4aba70',
              marginBottom: '8px',
              display: 'flex',
            }}
          >
            {total}
          </div>

          <div
            style={{
              fontSize: '16px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            Verified Peer-Reviewed Articles
          </div>

          {/* Year range + update info */}
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.35)',
              display: 'flex',
              gap: '16px',
            }}
          >
            <span>{yearRange}</span>
            <span>•</span>
            <span>Updated biweekly</span>
            <span>•</span>
            <span>ayahuasca-research.com</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
