'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [step, setStep] = useState(1); // 1: Request Email, 2: Code & New Password, 3: Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Send Reset Request
  const handleRequestReset = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Simulate sending 6-digit verification code
      const simulatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(simulatedCode);
      setCode(simulatedCode); // Auto-fill for friction-free developer/user testing!
      setStep(2);
      setLoading(false);
      setSuccess(`Verification code generated: ${simulatedCode}`);
    }, 600);
  };

  // Step 2: Confirm Code and Set New Password
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    if (code.trim() !== generatedCode) {
      setError('Invalid verification code. Please check and try again.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      setStep(3);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update password.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-ambient-glow" />

        <div className="auth-card bento-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-icon-badge">
              <KeyRound size={26} color="#ffffff" fill="#ffffff" />
            </div>
            <h1 className="auth-title">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify & Set Password'}
              {step === 3 && 'Password Updated!'}
            </h1>
            <p className="auth-subtitle">
              {step === 1 && 'Enter your email address to receive an on-device verification code.'}
              {step === 2 && 'Enter the verification code and choose your new secure password.'}
              {step === 3 && 'Your edge account password has been successfully updated.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && step === 2 && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={16} />
              <span>{success} (Auto-filled for testing)</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="auth-form">
              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-email">
                  Account Email Address
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="reset-email"
                    type="email"
                    className="auth-input"
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-pill auth-submit-btn"
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner-mini" />
                    <span>Generating Security Code...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter Code & New Password */}
          {step === 2 && (
            <form onSubmit={handleConfirmReset} className="auth-form">
              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-code">
                  6-Digit Verification Code
                </label>
                <div className="auth-input-wrapper">
                  <ShieldCheck size={18} className="auth-input-icon" />
                  <input
                    id="reset-code"
                    type="text"
                    className="auth-input"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="new-password">
                  New Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
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

              <div className="auth-field">
                <label className="auth-label" htmlFor="confirm-new-password">
                  Confirm New Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="confirm-new-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-pill auth-submit-btn"
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner-mini" />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  <>
                    <RotateCcw size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="auth-success-step">
              <div className="auth-success-icon-wrap">
                <CheckCircle2 size={44} color="#40c057" />
              </div>
              <p style={{ color: 'var(--clay-text-muted)', fontSize: '14px', lineHeight: 1.6, textAlign: 'center', margin: '14px 0 24px' }}>
                Your password has been changed. You can now sign in with your new credentials on any device connected to this node.
              </p>
              <Link
                href="/login"
                className="btn btn-primary btn-pill auth-submit-btn"
                style={{ textDecoration: 'none', justifyContent: 'center' }}
              >
                <span>Proceed to Sign In</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Back Navigation */}
          <div className="auth-switch-footer" style={{ justifyContent: 'center' }}>
            <Link href="/login" className="auth-switch-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
