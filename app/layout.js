import './globals.css';

export const metadata = {
  title: 'Ayahuasca Research Portal',
  description:
    'Ayahuasca Research Portal - A curated database of verified peer-reviewed articles and academic books spanning 1972-2026, updated biweekly. Every article verified via PubMed, DOI, or publisher records.',
  keywords:
    'ayahuasca, research, scientific literature, PubMed, clinical trials, psychedelic research, DMT, harmine',
  authors: [{ name: 'Ayahuasca Research Portal' }],
  openGraph: {
    title: 'Ayahuasca Research Portal',
    description:
      'A curated database of verified peer-reviewed articles and academic books on ayahuasca research, spanning 1972-2026. Updated biweekly.',
    type: 'website',
    url: 'https://www.ayahuasca-research.com/',
    images: [
      {
        url: 'https://www.ayahuasca-research.com/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayahuasca Research Portal',
    description:
      'A curated database of verified peer-reviewed articles and academic books on ayahuasca research, spanning 1972-2026. Updated biweekly.',
    images: ['https://www.ayahuasca-research.com/og-image.jpg'],
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
