// ============================================================
// Botanical SVG Decorative Elements
// ============================================================

export function LeafDivider() {
  return (
    <svg width="200" height="24" viewBox="0 0 200 24" fill="none" style={{ display: 'block', margin: '0 auto', opacity: 0.3 }}>
      <line x1="0" y1="12" x2="75" y2="12" stroke="currentColor" strokeWidth="0.5" />
      <line x1="125" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="0.5" />
      <path d="M100 4 C95 4, 88 10, 88 12 C88 14, 95 20, 100 20 C105 20, 112 14, 112 12 C112 10, 105 4, 100 4Z" stroke="currentColor" strokeWidth="0.75" fill="none" />
      <line x1="100" y1="4" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
      <path d="M92 8 C96 10, 96 14, 92 16" stroke="currentColor" strokeWidth="0.4" fill="none" />
      <path d="M108 8 C104 10, 104 14, 108 16" stroke="currentColor" strokeWidth="0.4" fill="none" />
    </svg>
  );
}

export function BotanicalCorner({ style }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.12, ...style }}>
      <path d="M0 80 C0 40, 10 20, 40 0" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M5 80 C5 50, 15 30, 35 10" stroke="currentColor" strokeWidth="0.7" fill="none" />
      <path d="M15 65 C20 55, 8 50, 5 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M25 45 C30 35, 18 30, 15 40" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M10 75 C18 68, 12 62, 8 70" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="40" cy="2" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function ScrollIndicator() {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
      <rect x="1" y="1" width="18" height="26" rx="9" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <circle cx="10" cy="8" r="2" fill="rgba(255,255,255,0.5)">
        <animate attributeName="cy" values="8;16;8" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// Leaf pattern for background - returns a CSS url() value
export const leafPatternUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M60 10 C55 10 40 30 40 50 C40 70 55 85 60 85 C65 85 80 70 80 50 C80 30 65 10 60 10Z' fill='none' stroke='%23455a47' stroke-width='0.4' opacity='0.06'/%3E%3Cpath d='M60 15 L60 80' fill='none' stroke='%23455a47' stroke-width='0.3' opacity='0.04'/%3E%3Cpath d='M48 30 C55 35 55 45 48 50' fill='none' stroke='%23455a47' stroke-width='0.25' opacity='0.04'/%3E%3Cpath d='M72 30 C65 35 65 45 72 50' fill='none' stroke='%23455a47' stroke-width='0.25' opacity='0.04'/%3E%3C/svg%3E")`;
