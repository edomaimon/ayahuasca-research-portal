import { useEffect, useRef } from 'react';
import StatCard from './StatCard';
import { LeafDivider, ScrollIndicator } from './BotanicalElements';

// ============================================================
// Hero Section Component
// ============================================================

export default function Hero({ stats }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Force video play on mobile devices
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  return (
    <header className="hero">
      {/* Video Background */}
      <div className="hero__video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          poster="https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=1920&q=80"
          className="hero__video"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-a-forest-after-the-rain-3007/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero__overlay" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__subtitle">
          Peer-Reviewed Scientific Literature Database
        </div>

        <h1 className="hero__title">
          Ayahuasca<br />Research Portal
        </h1>

        <div style={{ margin: '1.5rem auto', color: 'rgba(255,255,255,0.35)' }}>
          <LeafDivider />
        </div>

        <p className="hero__description">
          A curated collection of {stats.total} verified peer-reviewed articles
          spanning {stats.yearRange}. Every article authenticated via PubMed,
          DOI resolution, or publisher records.
        </p>

        <div className="hero__stats">
          <StatCard value={stats.total} label="Verified Articles" />
          <StatCard value={stats.openAccess} label="Open Access" />
          <StatCard value={`${Math.round(stats.totalCitations / 1000)}K+`} label="Total Citations" />
          <StatCard value={stats.journals} label="Journals" />
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="hero__scroll-hint">
        <ScrollIndicator />
      </div>
    </header>
  );
}
