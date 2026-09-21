'use client';
import { useState, useEffect } from 'react';
import { Laptop, Wifi, ShieldCheck, Copy, Cast, Cpu } from 'lucide-react';
import { checkBackendHealth } from '../lib/api';

export default function OfficeKitBridge() {
  const [health, setHealth] = useState(null);
  const [ping, setPing] = useState(4);
  const [isMirroring, setIsMirroring] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function poll() {
      const start = Date.now();
      const data = await checkBackendHealth();
      const elapsed = Math.max(2, Date.now() - start);
      if (mounted) {
        setHealth(data);
        setPing(elapsed);
      }
    }
    poll();
    const interval = setInterval(poll, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: 'var(--bento-border)',
      borderRadius: 'var(--bento-radius-md)',
      padding: '8px 18px',
      margin: '0 4px 16px 4px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--bento-primary-dark)',
      fontWeight: '600',
      boxShadow: 'var(--bento-shadow-xs)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: health?.status === 'online' ? 'var(--bento-accent-green-bg)' : 'var(--bento-accent-coral-bg)',
          color: health?.status === 'online' ? 'var(--bento-accent-green)' : 'var(--bento-accent-coral)',
          border: '1px solid rgba(47, 158, 68, 0.2)',
          borderRadius: 'var(--bento-radius-full)',
          padding: '2px 9px',
          fontSize: '11px',
          fontWeight: '700'
        }}>
          <span className="pulse-dot" style={{
            background: health?.status === 'online' ? 'var(--bento-accent-green)' : 'var(--bento-accent-coral)'
          }} />
          {health?.status === 'online' ? 'iQOO LINK ONLINE' : 'CONNECTING EDGE...'}
        </span>

        <span style={{ color: 'var(--bento-primary-surface)' }}>•</span>

        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--bento-primary-muted)',
          fontWeight: '600'
        }}>
          <Wifi size={12} />
          <span>{ping}ms Local Wi-Fi</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span title="Headless Laptop Compute with Lid Closed" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'var(--bento-primary-subtle)',
          padding: '3px 8px',
          borderRadius: 'var(--bento-radius-full)',
          color: 'var(--bento-primary-dark)',
          fontSize: '10px',
          fontWeight: '700',
          border: '1px solid rgba(73, 80, 87, 0.1)'
        }}>
          <Laptop size={11} />
          HEADLESS ENGINE
        </span>

        <button
          onClick={() => setIsMirroring(!isMirroring)}
          title="Toggle Screen Mirroring for Pitch"
          style={{
            background: isMirroring ? 'var(--bento-primary-deep)' : '#ffffff',
            color: isMirroring ? '#ffffff' : 'var(--bento-primary-dark)',
            border: 'var(--bento-border)',
            borderRadius: 'var(--bento-radius-full)',
            padding: '3px 9px',
            fontSize: '10px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: 'var(--bento-shadow-xs)'
          }}
        >
          <Cast size={11} />
          {isMirroring ? 'MIRRORING ON' : 'MIRROR'}
        </button>
      </div>
    </div>
  );
}
