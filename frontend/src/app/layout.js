import './globals.css';
import OfficeKitBridge from '../components/OfficeKitBridge';
import Link from 'next/link';
import { Zap, Sparkles, Home, Camera, FileText, Presentation } from 'lucide-react';

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
  themeColor: '#495057',
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
                  <span className="tag">iQOO</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 700, marginTop: '-2px' }}>
                  Edge Capture • Headless AI
                </div>
              </div>
            </Link>

            {/* Laptop / Desktop Navigation Links */}
            <nav className="desktop-nav-links">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/capture" className="nav-link">
                Capture
              </Link>
              <Link href="/studio" className="nav-link">
                Deliverables
              </Link>
              <Link href="/slides" className="nav-link">
                Slide Deck
              </Link>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/capture"
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontWeight: 800, background: '#ffffff', color: '#121416' }}
              >
                <Sparkles size={14} color="#495057" />
                <span>+ NEW</span>
              </Link>
            </div>
          </header>

          <OfficeKitBridge />

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
