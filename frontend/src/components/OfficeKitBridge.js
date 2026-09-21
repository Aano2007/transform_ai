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
      background: 'var(--nb-yellow-100)',
      borderBottom: '2px solid var(--nb-black)',
      padding: '8px 18px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--nb-black)',
      fontWeight: '700'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: health?.status === 'online' ? 'var(--nb-yellow)' : '#fecaca',
          color: health?.status === 'online' ? '#ffffff' : 'var(--nb-black)',
          border: '1.5px solid var(--nb-black)',
          boxShadow: '1.5px 1.5px 0px var(--nb-black)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '11px',
          fontWeight: '800'
        }}>
          <span className="pulse-dot" style={{
            background: health?.status === 'online' ? 'var(--nb-green)' : '#ef4444'
          }} />
          {health?.status === 'online' ? 'iQOO LINK ONLINE' : 'CONNECTING EDGE...'}
        </span>
        <span style={{ color: 'var(--nb-black)', opacity: 0.3 }}>|</span>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#fff',
          border: '1px solid var(--nb-black)',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          <Wifi size={12} color="var(--nb-black)" />
          {ping}ms Wi-Fi
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span title="Headless Laptop Compute with Lid Closed" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'var(--nb-yellow)',
          border: '1px solid var(--nb-black)',
          padding: '2px 7px',
          borderRadius: '4px',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '800'
        }}>
          <Laptop size={12} />
          HEADLESS ENGINE
        </span>

        <button
          onClick={() => setIsMirroring(!isMirroring)}
          title="Toggle Screen Mirroring for Pitch"
          style={{
            background: isMirroring ? 'var(--nb-black)' : '#fff',
            color: isMirroring ? '#ffffff' : 'var(--nb-black)',
            border: '1.5px solid var(--nb-black)',
            boxShadow: '1.5px 1.5px 0px var(--nb-black)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '10px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.1s ease'
          }}
        >
          <Cast size={11} />
          {isMirroring ? 'MIRRORING ON' : 'MIRROR'}
        </button>
      </div>
    </div>
  );
}
