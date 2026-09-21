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
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid var(--iqoo-cyan)',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.25)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '440px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(0, 240, 255, 0.15)',
              color: 'var(--iqoo-cyan)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              fontSize: '12px'
            }}>
              CITATION [{citation.id}]
            </span>
            <span style={{ fontSize: '12px', color: 'var(--iqoo-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} />
              Ground Truth Verified
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Synthesized Deliverable Claim:
          </label>
          <div style={{
            marginTop: '4px',
            padding: '10px 12px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            color: '#fff',
            borderLeft: '3px solid var(--iqoo-orange)'
          }}>
            {citation.claim}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Exact Source Quote (Raw Voice/OCR Telemetry):
          </label>
          <div style={{
            marginTop: '4px',
            padding: '12px',
            background: 'rgba(0, 240, 255, 0.06)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            color: 'var(--iqoo-cyan)',
            fontStyle: 'italic',
            borderLeft: '3px solid var(--iqoo-cyan)',
            display: 'flex',
            gap: '8px'
          }}>
            <Quote size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>"{citation.source_quote}"</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: '4px' }}
        >
          Close Citation
        </button>
      </div>
    </div>
  );
}
