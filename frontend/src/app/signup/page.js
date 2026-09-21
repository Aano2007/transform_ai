'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  CheckCircle2,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Executive Lead');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: '#fa5252' };
    if (score <= 3) return { level: 2, text: 'Good', color: '#fab005' };
    return { level: 3, text: 'Strong', color: '#40c057' };
  };

  const strength = getPasswordStrength();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the edge node privacy terms to proceed.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name,
        email,
        password,
        role,
      });

      setSuccess('Account created successfully! Welcome to TransformAI.');
      
      // Trigger rewarding confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff6b00', '#38bdf8', '#505760', '#2b8a3e'],
        });
      } catch (e) {}

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-ambient-glow" />

        <div className="auth-card bento-card">
          {/* Top Brand & Badge */}
          <div className="auth-header">
            <div className="auth-icon-badge">
              <Zap size={26} color="#ffffff" fill="#ffffff" />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join TransformAI with local edge intelligence and zero-latency transformation.
            </p>
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
          <form onSubmit={handleSignup} className="auth-form">
            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-name">
                Full Name
              </label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  className="auth-input"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Role / Track Selection */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-role">
                Primary Workspace Role
              </label>
              <div className="auth-input-wrapper">
                <Briefcase size={18} className="auth-input-icon" />
                <select
                  id="signup-role"
                  className="auth-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Executive Lead">Executive Lead / Strategy</option>
                  <option value="Product Manager">Product Manager / Owner</option>
                  <option value="Software Engineer">Software Engineer / Tech Lead</option>
                  <option value="Consultant">Consultant / Analyst</option>
                  <option value="Founder / CEO">Founder / CEO</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="strength-meter-wrapper">
                  <div className="strength-bars">
                    <div className={`strength-bar ${strength.level >= 1 ? 'filled' : ''}`} style={{ backgroundColor: strength.level >= 1 ? strength.color : '' }} />
                    <div className={`strength-bar ${strength.level >= 2 ? 'filled' : ''}`} style={{ backgroundColor: strength.level >= 2 ? strength.color : '' }} />
                    <div className={`strength-bar ${strength.level >= 3 ? 'filled' : ''}`} style={{ backgroundColor: strength.level >= 3 ? strength.color : '' }} />
                  </div>
                  <span className="strength-text" style={{ color: strength.color }}>
                    {strength.text} password
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-confirm">
                Confirm Password
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="signup-confirm"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="auth-remember-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>I accept the local Edge privacy protocol &bull; No telemetry sent to cloud</span>
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
                  <span>Configuring Node...</span>
                </div>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="auth-switch-footer">
            <span>Already have an account?</span>
            <Link href="/login" className="auth-switch-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
