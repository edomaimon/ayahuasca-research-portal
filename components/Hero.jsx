'use client';

import { useEffect, useRef, useState } from 'react';
import StatCard from './StatCard';
import { LeafDivider, ScrollIndicator } from './BotanicalElements';

export default function Hero({ stats }) {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, [isMobile]);

  return (
    <header className="hero">
      {/* Navigation Shortcuts */}
      <div className="hero__nav-links">
        <a href="#about" className="hero__about-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          About
        </a>
        <a href="#subscribe" className="hero__about-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Subscribe
        </a>
      </div>

      {/* Video Background — poster-only on mobile */}
      <div className="hero__video-wrapper">
        {!isMobile ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero__video"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-jungle-plants-3922/1080p.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          <div
            className="hero__poster"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1440581572325-0bea30075d9d?w=800&q=60)',
            }}
          />
        )}
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
          spanning {stats.yearRange}, updated with new research every two weeks.
          Each entry verified via PubMed, DOI, or publisher records.
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
