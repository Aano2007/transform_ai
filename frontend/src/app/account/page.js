'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  LogOut, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Briefcase,
  History,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || 'Alex Chen');
  const [role, setRole] = useState(user?.role || 'Executive Lead');
  const [avatar, setAvatar] = useState(user?.avatar || '⚡');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const avatarsList = ['⚡', '🚀', '🎯', '🔥', '🛡️', '🧠', '💼', '💡'];

  if (!isAuthenticated || !user) {
    return (
      <div className="content-wrapper" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="bento-card" style={{ maxWidth: '440px', textAlign: 'center', padding: '36px 24px' }}>
          <div className="auth-icon-badge" style={{ margin: '0 auto 16px' }}>
            <User size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Sign In Required</h2>
          <p style={{ color: 'var(--clay-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Please sign in to manage your account details and local edge node.
          </p>
          <Link href="/login" className="btn btn-primary btn-pill" style={{ justifyContent: 'center' }}>
            <span>Sign In to Continue</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      role,
      avatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="content-wrapper">
      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="btn btn-secondary btn-sm btn-pill" style={{ gap: '6px' }}>
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ gap: '6px', color: '#fa5252' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 12-Column Responsive Bento Layout */}
        <div className="bento-grid">
          {/* Bento Cell 1: Profile Overview Banner (Span 8) */}
          <div className="bento-card bento-span-8">
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="account-avatar-large">
                <span>{avatar}</span>
              </div>
              <div style={{ minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--clay-primary-deep)', margin: 0 }}>
                    {user.name}
                  </h1>
                  <span className="account-menu-tier-tag" style={{ alignSelf: 'center' }}>
                    <ShieldCheck size={11} />
                    <span>{user.plan || 'Pro Edge Tier'}</span>
                  </span>
                </div>
                <div style={{ color: 'var(--clay-text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  {user.email} &bull; Member since {user.memberSince || 'Sept 2026'}
                </div>
              </div>
            </div>

            {/* Avatar Selector */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--clay-primary)', display: 'block', marginBottom: '8px' }}>
                Select Workspace Avatar
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {avatarsList.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`avatar-choice-btn ${avatar === av ? 'active' : ''}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label">Workspace Role</label>
                  <div className="auth-input-wrapper">
                    <Briefcase size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                {savedSuccess ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clay-accent-green)', fontSize: '13px', fontWeight: 700 }}>
                    <Check size={16} />
                    <span>Profile settings saved!</span>
                  </div>
                ) : <div />}

                <button type="submit" className="btn btn-primary btn-sm btn-pill" style={{ gap: '6px' }}>
                  <Check size={14} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bento Cell 2: Edge Node Telemetry (Span 4) */}
          <div className="bento-card bento-span-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Cpu size={20} color="var(--clay-accent-green)" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Edge Node Telemetry</h3>
              </div>

              <div className="account-telemetry-item">
                <span className="telemetry-label">Assigned Node ID</span>
                <span className="telemetry-val">{user.nodeId || 'node-edge-049'}</span>
              </div>

              <div className="account-telemetry-item">
                <span className="telemetry-label">Compute Split</span>
                <span className="telemetry-val">Phone + Laptop</span>
              </div>

              <div className="account-telemetry-item">
                <span className="telemetry-label">Privacy Shield</span>
                <span className="telemetry-val" style={{ color: 'var(--clay-accent-green)' }}>100% On-Device</span>
              </div>

              <div className="account-telemetry-item">
                <span className="telemetry-label">Model Engine</span>
                <span className="telemetry-val">Llama-3.2 / Heuristic</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'var(--clay-card-inset)', borderRadius: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--clay-text-muted)', lineHeight: 1.5 }}>
                🔒 All voice memos, whiteboard OCR transcriptions, and generated PPT/DOCX files remain entirely on your local hardware.
              </div>
            </div>
          </div>

          {/* Bento Cell 3: Quick Usage Metrics (Span 12) */}
          <div className="bento-card bento-span-12">
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>
              Workspace Stats & Deliverables
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="stat-metric-card">
                <div className="stat-icon-badge">
                  <Sparkles size={18} color="var(--clay-primary-deep)" />
                </div>
                <div>
                  <div className="stat-num">{user.transformationsCount || 18}</div>
                  <div className="stat-lbl">Transformations Done</div>
                </div>
              </div>

              <div className="stat-metric-card">
                <div className="stat-icon-badge">
                  <FileText size={18} color="var(--clay-primary-deep)" />
                </div>
                <div>
                  <div className="stat-num">4 Formats</div>
                  <div className="stat-lbl">Brief, PPTX, Docx, Social</div>
                </div>
              </div>

              <div className="stat-metric-card">
                <div className="stat-icon-badge">
                  <HardDrive size={18} color="var(--clay-primary-deep)" />
                </div>
                <div>
                  <div className="stat-num">SQLite Local</div>
                  <div className="stat-lbl">Zero Cloud Storage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
