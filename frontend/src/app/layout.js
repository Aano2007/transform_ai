import './globals.css';
import OfficeKitBridge from '../components/OfficeKitBridge';
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
  themeColor: '#ff6b00',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <Link href="/" className="brand-badge">
              <div className="brand-logo">
                <Zap size={20} fill="#fff" />
              </div>
              <div>
                <div className="brand-title">
                  <span>TransformAI</span>
                  <span className="tag">iQOO</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '-2px' }}>
                  Edge Capture • Headless AI
                </div>
              </div>
            </Link>

            <Link href="/capture" className="btn btn-primary btn-sm" style={{ gap: '4px' }}>
              <Sparkles size={14} />
              <span>New</span>
            </Link>
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
