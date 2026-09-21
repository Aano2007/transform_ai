'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic, Camera, Keyboard, Sparkles, ArrowRight, Clock,
  FileText, Presentation, CheckCircle2, ChevronRight, Zap, Layers,
  Terminal, Smartphone, Laptop
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
    sessionStorage.setItem(
      'transformai_prefill_mode',
      tpl.category.toLowerCase().includes('voice')
        ? 'voice'
        : tpl.category.toLowerCase().includes('whiteboard')
        ? 'camera'
        : 'text'
    );
    router.push('/capture');
  };

  return (
    <div className="content-wrapper">
      {/* Neobrutalist Hero Banner */}
      <div className="card card-hero" style={{
        textAlign: 'center',
        padding: '36px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div className="card-badge-header">
          <Zap size={14} fill="var(--nb-black)" />
          <span>iQOO HACKATHON // PRODUCTIVITY TRACK</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: '900',
          lineHeight: '1.1',
          letterSpacing: '-1.2px',
          color: 'var(--nb-black)'
        }}>
          Capture Raw. <span style={{
            background: 'var(--nb-yellow)',
            padding: '2px 8px',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0px var(--nb-black)',
            borderRadius: '6px',
            display: 'inline-block'
          }}>Deliver Polished.</span>
        </h1>

        <p style={{
          fontSize: '15px',
          color: 'var(--nb-text-muted)',
          maxWidth: '560px',
          lineHeight: '1.5',
          fontWeight: '600'
        }}>
          One voice memo → 4 boardroom-ready deliverables in under 60 seconds.
          Zero prompt engineering. Powered by The Honest Split architecture.
        </p>

        {/* Primary CTA Button */}
        <Link
          href="/capture"
          className="btn btn-primary"
          style={{
            fontSize: '16px',
            padding: '16px 32px',
            marginTop: '8px'
          }}
        >
          <Sparkles size={18} />
          <span>+ START NEW TRANSFORMATION</span>
        </Link>
      </div>

      {/* 2-Column Responsive Dashboard Layout for Laptops / Desktops */}
      <div className="desktop-grid-2">
        {/* Left Column: Quick Capture Dock & 1-Click Demo Benchmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Capture Magnetic Dock Card */}
          <div className="card" style={{ textAlign: 'center', padding: '24px 18px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              color: 'var(--nb-black)',
              background: 'var(--nb-yellow-100)',
              border: '1.5px solid var(--nb-black)',
              padding: '3px 10px',
              borderRadius: '4px',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--nb-black)' }} />
              <span>Magnetic Dock // Quick Capture Modes</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MagneticDock
                items={[
                  {
                    id: 'voice',
                    label: 'Voice Memo',
                    icon: <Mic size={26} color="var(--nb-black)" />,
                    onClick: () => router.push('/capture?mode=voice'),
                    badge: 1
                  },
                  {
                    id: 'camera',
                    label: 'Scan OCR (Whiteboard)',
                    icon: <Camera size={26} color="var(--nb-black)" />,
                    onClick: () => router.push('/capture?mode=camera')
                  },
                  {
                    id: 'text',
                    label: 'Type / Paste Text',
                    icon: <Keyboard size={26} color="var(--nb-black)" />,
                    onClick: () => router.push('/capture?mode=text')
                  }
                ]}
                iconSize={56}
                maxScale={1.35}
                magneticDistance={140}
                variant="glass"
              />
            </div>
          </div>

          {/* 1-Click Demo Scenarios (Hackathon Pitch Benchmarks) */}
          <div className="card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              borderBottom: '2px solid var(--nb-black)',
              paddingBottom: '8px'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '900',
                color: 'var(--nb-black)',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Zap size={15} fill="var(--nb-yellow)" />
                <span>1-CLICK DEMO BENCHMARKS</span>
              </div>
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                background: 'var(--nb-yellow)',
                border: '1px solid var(--nb-black)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '800'
              }}>
                INSTANT
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleStartTemplate(tpl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--nb-surface)',
                    border: '2px solid var(--nb-black)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '2px 2px 0px var(--nb-black)',
                    padding: '12px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--nb-black)',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px var(--nb-black)';
                    e.currentTarget.style.background = 'var(--nb-yellow-100)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = '2px 2px 0px var(--nb-black)';
                    e.currentTarget.style.background = 'var(--nb-surface)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--nb-black)' }}>
                      {tpl.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--nb-text-muted)', marginTop: '2px', fontWeight: '600' }}>
                      {tpl.category} • Under 60s transformation
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--nb-black)" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Transformations & Honest Split Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Recent Transformations */}
          <div className="card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              borderBottom: '2px solid var(--nb-black)',
              paddingBottom: '8px'
            }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '900',
                color: 'var(--nb-black)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)'
              }}>
                Recent Transformations ({recentTrans.length})
              </h3>
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                background: 'var(--nb-yellow-100)',
                border: '1px solid var(--nb-black)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                Persisted
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentTrans.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push('/studio')}
                  style={{
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'var(--nb-surface)',
                    border: '2px solid var(--nb-black)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '2px 2px 0px var(--nb-black)',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px var(--nb-black)';
                    e.currentTarget.style.background = 'var(--nb-yellow-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = '2px 2px 0px var(--nb-black)';
                    e.currentTarget.style.background = 'var(--nb-surface)';
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--nb-black)' }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--nb-text-dim)',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <Clock size={12} color="var(--nb-black)" />
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span style={{
                        background: 'var(--nb-yellow)',
                        border: '1px solid var(--nb-black)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontWeight: '800',
                        color: 'var(--nb-black)'
                      }}>
                        {item.formatsCount} Formats
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--nb-black)" />
                </div>
              ))}
            </div>
          </div>

          {/* Honest Split Hardware Architecture Card */}
          <div className="card card-yellow" style={{ padding: '18px' }}>
            <div style={{
              color: 'var(--nb-black)',
              fontWeight: '900',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
              borderBottom: '2px solid var(--nb-black)',
              paddingBottom: '6px'
            }}>
              <Terminal size={15} />
              <span>THE HONEST SPLIT ARCHITECTURE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                background: '#fff',
                padding: '10px',
                borderRadius: '6px',
                border: '1.5px solid var(--nb-black)',
                boxShadow: '1.5px 1.5px 0px var(--nb-black)'
              }}>
                <Smartphone size={18} color="var(--nb-black)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--nb-black)' }}>iQOO Mobile Edge:</strong>
                  <div style={{ fontSize: '12px', color: 'var(--nb-text-muted)', marginTop: '2px' }}>
                    100% on-device Web Speech STT and Tesseract WASM OCR. Zero raw audio uploaded to cloud.
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                background: '#fff',
                padding: '10px',
                borderRadius: '6px',
                border: '1.5px solid var(--nb-black)',
                boxShadow: '1.5px 1.5px 0px var(--nb-black)'
              }}>
                <Laptop size={18} color="var(--nb-black)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--nb-black)' }}>Laptop Compute Engine:</strong>
                  <div style={{ fontSize: '12px', color: 'var(--nb-text-muted)', marginTop: '2px' }}>
                    Headless local Ollama LLM + python-pptx generation over high-speed local Wi-Fi.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
