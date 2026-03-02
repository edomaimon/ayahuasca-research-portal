// =============================================================
// Newsletter Subscribe Component
// =============================================================
// Add this to your site (e.g., footer, About page, or homepage)
// Replace YOUR_BUTTONDOWN_USERNAME with your Buttondown username
//
// Usage: import Subscribe from './Subscribe';
//        <Subscribe />
// =============================================================

import { useState } from 'react';

const BUTTONDOWN_USERNAME = 'ayahuasca-research'; // ← Replace this

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      // Buttondown's built-in form endpoint (no API key needed client-side)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://buttondown.com/api/emails/embed-subscribe/${ayahuasca-research}`;
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
    <div style={{
      background: 'linear-gradient(135deg, #0d1f15 0%, #091a10 100%)',
      border: '1px solid rgba(74, 222, 128, 0.15)',
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      <h3 style={{
        color: '#e8c872',
        fontSize: '1.25rem',
        fontFamily: 'Vollkorn, serif',
        margin: '0 0 8px 0',
      }}>
        Stay Updated
      </h3>
      <p style={{
        color: '#a7f3d0',
        fontSize: '0.9rem',
        margin: '0 0 20px 0',
        lineHeight: 1.5,
        opacity: 0.8,
      }}>
        Get notified when new ayahuasca research papers are added to the portal.
        Delivered every two weeks.
      </p>

      {status === 'success' ? (
        <p style={{
          color: '#4ade80',
          fontSize: '0.95rem',
          padding: '12px 16px',
          background: 'rgba(74, 222, 128, 0.1)',
          borderRadius: '8px',
          margin: 0,
        }}>
          Check your email to confirm your subscription.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              background: 'rgba(0, 0, 0, 0.3)',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: status === 'loading' ? '#2d6a4f' : '#4ade80',
              color: '#020604',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: status === 'loading' ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '8px' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
