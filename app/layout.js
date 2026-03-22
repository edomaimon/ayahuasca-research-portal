import './globals.css';

const SITE_URL = 'https://www.ayahuasca-research.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ayahuasca Research Portal',
    template: '%s | Ayahuasca Research Portal',
  },
  description:
    'A curated database of verified peer-reviewed articles and academic books on ayahuasca research, spanning 1972-2026. Updated biweekly. Every article verified via PubMed, DOI, or publisher records.',
  keywords:
    'ayahuasca, research, scientific literature, PubMed, clinical trials, psychedelic research, DMT, harmine',
  authors: [{ name: 'Ayahuasca Research Portal' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ayahuasca Research Portal',
    description:
      'A curated database of verified peer-reviewed articles and academic books on ayahuasca research, spanning 1972-2026. Updated biweekly.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Ayahuasca Research Portal',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Figtree:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
