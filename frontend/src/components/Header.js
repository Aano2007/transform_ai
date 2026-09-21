'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Zap, 
  Sparkles, 
  User, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Layers, 
  Settings, 
  Cpu,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="app-header">
      {/* Brand Identity */}
      <Link href="/" className="brand-badge">
        <div className="brand-logo">
          <Zap size={22} fill="#ffffff" color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">
            <span>TransformAI</span>
            <span className="tag">Edge AI</span>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--clay-primary-muted)',
              fontWeight: 600,
              marginTop: '-2px',
            }}
          >
            Headless Local AI Engine
          </div>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="desktop-nav-links">
        <Link 
          href="/" 
          className={`nav-link ${pathname === '/' ? 'active' : ''}`}
        >
          Overview
        </Link>
        <Link 
          href="/capture" 
          className={`nav-link ${pathname === '/capture' ? 'active' : ''}`}
        >
          Capture
        </Link>
        <Link 
          href="/studio" 
          className={`nav-link ${pathname === '/studio' ? 'active' : ''}`}
        >
          Deliverables
        </Link>
        <Link 
          href="/slides" 
          className={`nav-link ${pathname === '/slides' ? 'active' : ''}`}
        >
          Deck Stage
        </Link>
      </nav>

      {/* Right Controls & Account Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          href="/capture"
          className="btn btn-primary btn-sm btn-pill"
          style={{ gap: '6px' }}
        >
          <Sparkles size={14} />
          <span>+ New Memo</span>
        </Link>

        {/* Account Section */}
        {isAuthenticated && user ? (
          <div className="account-dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`account-pill ${dropdownOpen ? 'active' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User Account Menu"
              aria-expanded={dropdownOpen}
            >
              <div className="account-avatar-mini">
                <span>{user.avatar || '👤'}</span>
              </div>
              <div className="account-pill-text">
                <span className="account-name">{user.name.split(' ')[0]}</span>
                <span className="account-status-dot"></span>
              </div>
              <ChevronDown 
                size={14} 
                className={`account-chevron ${dropdownOpen ? 'rotated' : ''}`} 
              />
            </button>

            {/* Interactive Claymorphic Account Dropdown Menu */}
            {dropdownOpen && (
              <div className="account-menu-card">
                {/* User Header */}
                <div className="account-menu-header">
                  <div className="account-menu-avatar">
                    <span>{user.avatar || '👤'}</span>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="account-menu-name">{user.name}</div>
                    <div className="account-menu-email">{user.email}</div>
                    <div className="account-menu-tier-tag">
                      <ShieldCheck size={11} />
                      <span>{user.plan || 'Pro Edge Tier'}</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Node Info */}
                <div className="account-node-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={13} color="var(--clay-accent-green)" />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--clay-primary-deep)' }}>
                      Local Node
                    </span>
                  </div>
                  <span className="account-node-id">{user.nodeId || 'node-edge-049'}</span>
                </div>

                {/* Quick Menu Actions */}
                <div className="account-menu-links">
                  <Link 
                    href="/account" 
                    className="account-menu-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={15} />
                    <span>Account & Settings</span>
                  </Link>
                  <Link 
                    href="/studio" 
                    className="account-menu-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Layers size={15} />
                    <span>Saved Deliverables</span>
                  </Link>
                </div>

                <div className="account-menu-divider" />

                {/* Sign Out Action */}
                <button
                  type="button"
                  className="account-menu-item logout-item"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              href="/login"
              className="btn btn-secondary btn-sm btn-pill"
              style={{ gap: '5px' }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary btn-sm btn-pill desktop-only-btn"
              style={{ gap: '5px' }}
            >
              <UserPlus size={13} />
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
