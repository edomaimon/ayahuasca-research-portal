// =============================================================
// Ayahuasca Research Digest — Subscribe Component
// =============================================================

import { useState } from 'react';

const BUTTONDOWN_USERNAME = 'ayahuasca-research';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;
      form.target = '_blank';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'email';
      input.value = email;
      form.appendChild(input);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section style={{
      background: '#fff',
      borderTop: '1px solid #d5d0c6',
      borderBottom: '1px solid #d5d0c6',
      padding: '3.5rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '520px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Label */}
        <div style={{
          fontSize: '0.68rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#8a9688',
          fontFamily: "'Figtree', system-ui, sans-serif",
          fontWeight: 600,
          marginBottom: '0.75rem',
        }}>
          Bi-Weekly Research Digest
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Vollkorn', Georgia, serif",
          fontSize: '1.4rem',
          fontWeight: 600,
          color: '#2a3028',
          margin: '0 0 0.75rem 0',
          lineHeight: 1.3,
        }}>
          Ayahuasca Research Digest
        </h2>

        {/* Description */}
        <p style={{
          fontFamily: "'Figtree', system-ui, sans-serif",
          fontSize: '0.88rem',
          lineHeight: 1.7,
          color: '#556355',
          margin: '0 0 1.5rem 0',
          maxWidth: '440px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          A curated summary of new peer-reviewed ayahuasca research articles 
          published in the past two weeks, delivered straight to your inbox 
          on the 1st and 15th of every month.
        </p>

        {/* Form or Success */}
        {status === 'success' ? (
          <div style={{
            padding: '14px 20px',
            background: '#e8f5e9',
            border: '1px solid #c8e6c9',
            borderRadius: '6px',
            color: '#2e5a34',
            fontSize: '0.88rem',
            fontFamily: "'Figtree', system-ui, sans-serif",
            fontWeight: 500,
          }}>
            Check your email to confirm your subscription.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '8px',
            maxWidth: '420px',
            margin: '0 auto',
          }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '6px',
                border: '1px solid #d5d0c6',
                background: '#faf8f4',
                color: '#2a3028',
                fontSize: '0.88rem',
                fontFamily: "'Figtree', system-ui, sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2e5a34';
                e.target.style.boxShadow = '0 0 0 3px rgba(46, 90, 52, 0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d5d0c6';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                background: status === 'loading' ? '#4a7a50' : '#2e5a34',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                fontFamily: "'Figtree', system-ui, sans-serif",
                cursor: status === 'loading' ? 'wait' : 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { if (status !== 'loading') e.target.style.background = '#4a7a50'; }}
              onMouseLeave={(e) => { if (status !== 'loading') e.target.style.background = '#2e5a34'; }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{
            color: '#c25a6a',
            fontSize: '0.82rem',
            marginTop: '10px',
            fontFamily: "'Figtree', system-ui, sans-serif",
          }}>
            Something went wrong. Please try again.
          </p>
        )}

        {/* Privacy note */}
        <p style={{
          fontSize: '0.72rem',
          color: '#8a9688',
          marginTop: '1rem',
          fontFamily: "'Figtree', system-ui, sans-serif",
        }}>
          No spam. Unsubscribe anytime. Powered by Buttondown.
        </p>
      </div>
    </section>
  );
}
