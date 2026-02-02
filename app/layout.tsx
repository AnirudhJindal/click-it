import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CLICKC - Turn Attention Into Income',
  description: 'A UGC and clipping platform built for creators. Turn attention into income.',
  keywords: ['UGC', 'clipping', 'creators', 'content', 'short form', 'reels'],
  authors: [{ name: 'CLICKC' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}