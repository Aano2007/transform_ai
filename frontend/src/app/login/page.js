'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setSuccess('Signed in successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 700);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setError('');
    setSuccess('Entering as Pro Edge Demo Lead...');
    quickDemoLogin();
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* Glow ambient background element */}
        <div className="auth-ambient-glow" />

        <div className="auth-card bento-card">
          {/* Top Brand & Badge */}
          <div className="auth-header">
            <div className="auth-icon-badge">
              <Zap size={26} color="#ffffff" fill="#ffffff" />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to your local Edge AI workspace and saved transformations.
            </p>
          </div>

          {/* 1-Click Instant Demo Login CTA */}
          <div className="auth-demo-banner">
            <div className="auth-demo-text">
              <span className="auth-demo-tag">Quick Test</span>
              <span className="auth-demo-desc">Instant access without typing credentials</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-pill auth-demo-btn"
              onClick={handleDemoLogin}
            >
              <Sparkles size={14} color="var(--clay-accent-green)" />
              <span>1-Click Demo</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or sign in with credentials</span>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="auth-form">
            {/* Email Field */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="email-input">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="email-input"
                  type="email"
                  className="auth-input"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label" htmlFor="password-input">
                  Password
                </label>
                <Link href="/forgot-password" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="auth-remember-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>Keep me signed in on this edge device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-pill auth-submit-btn"
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner-mini" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security & Node Telemetry Footer */}
          <div className="auth-security-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clay-primary-muted)', fontSize: '11.5px' }}>
              <ShieldCheck size={14} color="var(--clay-accent-green)" />
              <span>Zero-Cloud Transmission &bull; 100% Local On-Device Identity</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="auth-switch-footer">
            <span>Don't have an account yet?</span>
            <Link href="/signup" className="auth-switch-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
