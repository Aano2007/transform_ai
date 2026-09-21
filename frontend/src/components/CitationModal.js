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
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
      animation: 'fadeIn 0.15s ease'
    }}>
      <div style={{
        background: '#ffffff',
        border: '3px solid var(--nb-black)',
        boxShadow: '8px 8px 0px var(--nb-black)',
        borderRadius: 'var(--radius-md)',
        width: '100%',
        maxWidth: '480px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'var(--nb-yellow)',
              color: 'var(--nb-black)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0px var(--nb-black)',
              borderRadius: '4px',
              padding: '3px 10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '900',
              fontSize: '12px'
            }}>
              CITATION [{citation.id}]
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--nb-black)',
              background: '#dcfce7',
              border: '1.5px solid var(--nb-black)',
              padding: '2px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '800'
            }}>
              <ShieldCheck size={14} color="#15803d" />
              Ground Truth Grounded
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--nb-yellow-100)',
              border: '1.5px solid var(--nb-black)',
              borderRadius: '4px',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div>
          <label style={{
            fontSize: '11px',
            color: 'var(--nb-black)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '900',
            fontFamily: 'var(--font-mono)'
          }}>
            Synthesized Deliverable Claim:
          </label>
          <div style={{
            marginTop: '6px',
            padding: '12px 14px',
            background: 'var(--nb-yellow-50)',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--nb-black)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0px var(--nb-black)',
            borderLeft: '5px solid var(--nb-yellow)'
          }}>
            {citation.claim}
          </div>
        </div>

        <div>
          <label style={{
            fontSize: '11px',
            color: 'var(--nb-black)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '900',
            fontFamily: 'var(--font-mono)'
          }}>
            Exact Source Quote (Raw Voice / OCR Telemetry):
          </label>
          <div style={{
            marginTop: '6px',
            padding: '14px',
            background: '#ffffff',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--nb-black)',
            fontStyle: 'italic',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0px var(--nb-black)',
            borderLeft: '5px solid var(--nb-black)',
            display: 'flex',
            gap: '8px'
          }}>
            <Quote size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>"{citation.source_quote}"</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '6px' }}
        >
          Dismiss Inspector
        </button>
      </div>
    </div>
  );
}
