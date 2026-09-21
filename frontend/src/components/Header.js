'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, Sparkles, ChevronDown, LogOut, User, Cpu, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/capture', label: 'Capture' },
    { href: '/studio', label: 'Deliverables' },
    { href: '/slides', label: 'Deck Stage' },
  ];

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push('/');
  };

  return (
    <header className="app-header">
      <Link href="/" className="brand-badge">
        <div className="brand-logo">
          <Zap size={22} fill="#ffffff" color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">
            <span>TransformAI</span>
            <span className="tag">Edge AI</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: 600, marginTop: '-2px' }}>
            Headless Local AI Engine
          </div>
        </div>
      </Link>

      <nav className="desktop-nav-links">
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className={`nav-link${pathname === href ? ' active' : ''}`}>
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isAuthenticated && user ? (
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setOpen(v => !v)}
              className="account-pill"
              aria-expanded={open}
            >
              <div className="account-avatar">{user.avatar}</div>
              <div className="account-pill-info">
                <span className="account-pill-name">{user.name.split(' ')[0]}</span>
                <span className="auth-badge">{user.plan}</span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--clay-primary-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
            </button>

            {open && (
              <div className="account-dropdown">
                <div className="account-dropdown-header">
                  <div className="account-avatar account-avatar-lg">{user.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--clay-primary-deep)' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', marginTop: '2px' }}>{user.email}</div>
                  </div>
                </div>

                <div className="account-dropdown-status">
                  <div className="pulse-dot" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--clay-accent-green)' }}>Edge Node Active</span>
                </div>

                <div className="account-dropdown-divider" />

                <Link href="/account" className="account-dropdown-item" onClick={() => setOpen(false)}>
                  <User size={14} />
                  <span>Account & Settings</span>
                </Link>
                <Link href="/capture" className="account-dropdown-item" onClick={() => setOpen(false)}>
                  <Sparkles size={14} />
                  <span>New Transformation</span>
                </Link>

                <div className="account-dropdown-divider" />

                <button className="account-dropdown-item account-dropdown-item-danger" onClick={handleLogout}>
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-secondary btn-sm btn-pill" style={{ gap: '6px' }}>
              <LogIn size={13} />
              <span>Sign In</span>
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm btn-pill" style={{ gap: '6px' }}>
              <UserPlus size={13} />
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
