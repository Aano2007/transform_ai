'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic, Camera, Keyboard, Sparkles, ArrowRight, Clock,
  FileText, Presentation, CheckCircle2, ChevronRight, Zap, Layers
} from 'lucide-react';
import { fetchSampleTemplates } from '../lib/api';
import { MagneticDock } from '../components/ui/magnetic-dock';

export default function HomeScreen() {
  const router = useRouter();
  const [recentTrans, setRecentTrans] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Load persisted history from localStorage or fallbacks
    const stored = localStorage.getItem('transformai_history');
    if (stored) {
      try {
        setRecentTrans(JSON.parse(stored));
      } catch (e) {}
    } else {
      const defaultHistory = [
        {
          id: 'hist_1',
          title: 'iQOO Product Strategy All-Hands',
          timestamp: '10 mins ago',
          formatsCount: 4,
          primaryObjective: 'Align engineering deliverables and hit Q3 launch.'
        },
        {
          id: 'hist_2',
          title: 'Growth Architecture Whiteboard OCR',
          timestamp: '2 hours ago',
          formatsCount: 4,
          primaryObjective: 'Scale retention from 42% to 58%.'
        },
        {
          id: 'hist_3',
          title: 'Executive Client Debrief (Singapore)',
          timestamp: 'Yesterday',
          formatsCount: 3,
          primaryObjective: 'Enterprise pilot deployment with 250 seats.'
        }
      ];
      setRecentTrans(defaultHistory);
      localStorage.setItem('transformai_history', JSON.stringify(defaultHistory));
    }

    // Load templates for quick-start
    fetchSampleTemplates().then((tpls) => {
      if (tpls && tpls.length > 0) setTemplates(tpls);
    });
  }, []);

  const handleStartTemplate = (tpl) => {
    sessionStorage.setItem('transformai_prefill_text', tpl.text);
    sessionStorage.setItem('transformai_prefill_mode', tpl.category.toLowerCase().includes('voice') ? 'voice' : tpl.category.toLowerCase().includes('whiteboard') ? 'camera' : 'text');
    router.push('/capture');
  };

  return (
    <div className="content-wrapper">
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '24px 10px 10px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 107, 0, 0.12)',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--iqoo-orange)',
          fontWeight: '700'
        }}>
          <Zap size={12} />
          iQOO HACKATHON // PRODUCTIVITY TRACK
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: '900',
          lineHeight: '1.15',
          letterSpacing: '-0.8px',
          background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Capture Raw.<br />Deliver Polished.
        </h1>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          maxWidth: '340px',
          lineHeight: '1.45'
        }}>
          One voice memo → 4 finished deliverables. No typing, no prompts, no manual formatting.
        </p>

        {/* Primary CTA Button */}
        <Link
          href="/capture"
          className="btn btn-primary"
          style={{
            width: '100%',
            maxWidth: '340px',
            fontSize: '16px',
            padding: '16px 24px',
            marginTop: '8px'
          }}
        >
          <Sparkles size={18} />
          <span>+ NEW TRANSFORMATION</span>
        </Link>
      </div>

      {/* 3 Quick-Start Input Modes: Magnetic Dock */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 0',
        margin: '4px 0 8px 0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '700',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.8px',
          textTransform: 'uppercase'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--iqoo-cyan)' }} />
          <span>Magnetic Dock // Quick Capture</span>
        </div>

        <MagneticDock
          items={[
            {
              id: 'voice',
              label: 'Voice Memo',
              icon: <Mic size={26} color="var(--iqoo-orange)" />,
              onClick: () => router.push('/capture?mode=voice'),
              badge: 1
            },
            {
              id: 'camera',
              label: 'Scan OCR (Whiteboard)',
              icon: <Camera size={26} color="var(--iqoo-cyan)" />,
              onClick: () => router.push('/capture?mode=camera')
            },
            {
              id: 'text',
              label: 'Type / Paste Text',
              icon: <Keyboard size={26} color="var(--iqoo-purple)" />,
              onClick: () => router.push('/capture?mode=text')
            }
          ]}
          iconSize={56}
          maxScale={1.5}
          magneticDistance={150}
          variant="glass"
        />
      </div>

      {/* 1-Click Demo Scenarios (Hackathon Pitch Feature) */}
      <div className="card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--iqoo-cyan)', fontFamily: 'var(--font-mono)' }}>
            ⚡ 1-CLICK DEMO BENCHMARKS
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Instant Test</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleStartTemplate(tpl)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                color: 'inherit',
                transition: 'all 0.15s'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                  {tpl.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {tpl.category} • Under 60s transformation
                </div>
              </div>
              <ChevronRight size={16} color="var(--iqoo-orange)" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transformations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recent Transformations (3)
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Persisted</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentTrans.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push('/studio')}
              className="card"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={11} />
                  <span>{item.timestamp}</span>
                  <span>•</span>
                  <span style={{ color: 'var(--iqoo-cyan)' }}>{item.formatsCount} Deliverables</span>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-dim)" />
            </div>
          ))}
        </div>
      </div>

      {/* Core Architecture Differentiators */}
      <div style={{
        padding: '14px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 107, 0, 0.05)',
        border: '1px solid rgba(255, 107, 0, 0.2)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ color: 'var(--iqoo-orange)', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
          THE HONEST SPLIT ARCHITECTURE:
        </div>
        <div>• <strong>iQOO Phone:</strong> On-device Speech STT & WASM OCR edge client.</div>
        <div>• <strong>Laptop Engine:</strong> Headless Ollama LLM + python-pptx over local Wi-Fi.</div>
      </div>
    </div>
  );
}
