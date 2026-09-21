'use client';
import { X, Quote, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CitationModal({ citation, rawText, onClose }) {
  if (!citation) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(33, 37, 41, 0.45)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
      animation: 'fadeIn 0.15s ease'
    }}>
      <div style={{
        background: '#ffffff',
        border: 'var(--bento-border)',
        boxShadow: 'var(--bento-shadow-lg)',
        borderRadius: 'var(--bento-radius-lg)',
        width: '100%',
        maxWidth: '460px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'var(--bento-accent-blue-bg)',
              color: 'var(--bento-accent-blue)',
              border: '1px solid rgba(25, 113, 194, 0.2)',
              borderRadius: 'var(--bento-radius-full)',
              padding: '2px 10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '800',
              fontSize: '11px'
            }}>
              CITATION [{citation.id}]
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--bento-accent-green)',
              background: 'var(--bento-accent-green-bg)',
              border: '1px solid rgba(47, 158, 68, 0.2)',
              padding: '2px 8px',
              borderRadius: 'var(--bento-radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700'
            }}>
              <ShieldCheck size={13} />
              Grounded Fact
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bento-primary-subtle)',
              border: 'none',
              borderRadius: 'var(--bento-radius-full)',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--bento-primary-muted)',
              transition: 'background 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div>
          <label style={{
            fontSize: '11px',
            color: 'var(--bento-primary-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '700',
            fontFamily: 'var(--font-mono)'
          }}>
            Synthesized Deliverable Claim:
          </label>
          <div style={{
            marginTop: '6px',
            padding: '12px 14px',
            background: 'var(--bento-primary-subtle)',
            borderRadius: 'var(--bento-radius-sm)',
            fontSize: '13.5px',
            fontWeight: '600',
            color: 'var(--bento-primary-deep)',
            borderLeft: '3px solid var(--bento-primary)'
          }}>
            {citation.claim}
          </div>
        </div>

        <div>
          <label style={{
            fontSize: '11px',
            color: 'var(--bento-primary-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '700',
            fontFamily: 'var(--font-mono)'
          }}>
            Exact Source Quote (Telemetry Grounding):
          </label>
          <div style={{
            marginTop: '6px',
            padding: '12px 14px',
            background: '#ffffff',
            borderRadius: 'var(--bento-radius-sm)',
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--bento-primary-dark)',
            fontStyle: 'italic',
            border: 'var(--bento-border)',
            borderLeft: '3px solid var(--bento-accent-blue)',
            display: 'flex',
            gap: '8px'
          }}>
            <Quote size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--bento-accent-blue)' }} />
            <span>"{citation.source_quote}"</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary btn-pill"
          style={{ width: '100%', marginTop: '4px' }}
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
}
