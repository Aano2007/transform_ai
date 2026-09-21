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
      background: 'rgba(15, 23, 42, 0.9)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '8px 16px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--text-muted)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: health?.status === 'online' ? 'var(--iqoo-green)' : 'var(--iqoo-orange)'
        }}>
          <span className="pulse-dot" style={{
            background: health?.status === 'online' ? 'var(--iqoo-green)' : 'var(--iqoo-orange)'
          }} />
          {health?.status === 'online' ? 'iQOO LINK ACTIVE' : 'CONNECTING EDGE...'}
        </span>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Wifi size={12} color="var(--iqoo-cyan)" />
          {ping}ms Wi-Fi
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span title="Headless Laptop Compute with Lid Closed" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 107, 0, 0.1)',
          padding: '2px 6px',
          borderRadius: '4px',
          color: 'var(--iqoo-orange)',
          fontSize: '10px'
        }}>
          <Laptop size={11} />
          HEADLESS
        </span>

        <button
          onClick={() => setIsMirroring(!isMirroring)}
          title="Toggle Screen Mirroring for Pitch"
          style={{
            background: isMirroring ? 'var(--iqoo-cyan)' : 'transparent',
            color: isMirroring ? '#000' : 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <Cast size={11} />
          {isMirroring ? 'MIRRORING' : 'MIRROR'}
        </button>
      </div>
    </div>
  );
}
