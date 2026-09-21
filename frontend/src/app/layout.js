import './globals.css';
import Link from 'next/link';
import { Zap, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'TransformAI | iQOO Productivity Track',
  description: 'One voice memo to four finished deliverables in under 60 seconds.',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#eef1f6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <Link href="/" className="brand-badge">
              <div className="brand-logo">
                <Zap size={22} fill="#ffffff" color="#ffffff" />
              </div>
              <div>
                <div className="brand-title">
                  <span>TransformAI</span>
                  <span className="tag">iQOO Edge</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: 600, marginTop: '-2px' }}>
                  Headless Local AI Engine
                </div>
              </div>
            </Link>

            {/* Clay Tactile Pill Navigation */}
            <nav className="desktop-nav-links">
              <Link href="/" className="nav-link">
                Overview
              </Link>
              <Link href="/capture" className="nav-link">
                Capture
              </Link>
              <Link href="/studio" className="nav-link">
                Deliverables
              </Link>
              <Link href="/slides" className="nav-link">
                Deck Stage
              </Link>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/capture"
                className="btn btn-primary btn-sm btn-pill"
                style={{ gap: '6px' }}
              >
                <Sparkles size={14} />
                <span>+ New Memo</span>
              </Link>
            </div>
          </header>

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
