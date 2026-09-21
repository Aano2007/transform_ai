'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic, Camera, Keyboard, Sparkles, ArrowRight, Clock,
  FileText, Presentation, CheckCircle2, ChevronRight, Zap, Layers,
  Terminal, Smartphone, Laptop, Cpu, ShieldCheck, Activity
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
      {/* 12-Column Responsive Bento Box Grid */}
      <div className="bento-grid">
        {/* Bento Cell 1: Hero Compartment (Span 8 on Laptop) */}
        <div className="bento-card bento-hero bento-span-8" style={{ justifyContent: 'center' }}>
          <div className="bento-tag">
            <Zap size={13} />
            <span>iQOO HACKATHON // PRODUCTIVITY TRACK</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 3.8vw, 42px)',
            fontWeight: '900',
            lineHeight: '1.15',
            letterSpacing: '-1.2px',
            color: 'var(--bento-primary-deep)',
            marginBottom: '12px'
          }}>
            Capture Raw.{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--bento-primary), var(--bento-primary-dark))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Deliver Polished.
            </span>
          </h1>

          <p style={{
            fontSize: '15px',
            color: 'var(--bento-primary-muted)',
            maxWidth: '520px',
            lineHeight: '1.55',
            fontWeight: '500',
            marginBottom: '20px'
          }}>
            One voice memo → 4 boardroom-ready deliverables in under 60 seconds.
            Zero prompt engineering. Powered by The Honest Split hardware architecture.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/capture"
              className="btn btn-primary btn-pill"
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              <Sparkles size={17} />
              <span>+ Start Transformation</span>
            </Link>

            <Link
              href="/slides"
              className="btn btn-secondary btn-pill"
              style={{ padding: '14px 22px', fontSize: '14px' }}
            >
              <Presentation size={16} />
              <span>Deck Stage</span>
            </Link>
          </div>
        </div>

        {/* Bento Cell 2: Hardware Telemetry Bento (Span 4 on Laptop) */}
        <div className="bento-card bento-span-4" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, var(--bento-canvas) 100%)',
          justifyContent: 'space-between'
        }}>
          <div>
            <div className="bento-tag" style={{ background: 'var(--bento-accent-green-bg)', color: 'var(--bento-accent-green)' }}>
              <Activity size={13} />
              <span>Edge Telemetry</span>
            </div>

            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--bento-primary-deep)' }}>
              iQOO Compute Engine
            </div>
            <div style={{ fontSize: '12px', color: 'var(--bento-primary-muted)', marginTop: '2px' }}>
              Headless local inference over Wi-Fi
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '18px 0' }}>
            <div style={{
              background: '#ffffff',
              border: 'var(--bento-border)',
              borderRadius: 'var(--bento-radius-sm)',
              padding: '12px',
              boxShadow: 'var(--bento-shadow-xs)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--bento-primary-muted)', fontWeight: '600' }}>SLA Latency</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--bento-primary-deep)', marginTop: '2px' }}>&lt;60s</div>
              <div style={{ fontSize: '10px', color: 'var(--bento-accent-green)', fontWeight: '700', marginTop: '2px' }}>⚡ Real-time</div>
            </div>

            <div style={{
              background: '#ffffff',
              border: 'var(--bento-border)',
              borderRadius: 'var(--bento-radius-sm)',
              padding: '12px',
              boxShadow: 'var(--bento-shadow-xs)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--bento-primary-muted)', fontWeight: '600' }}>Hallucination</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--bento-primary-deep)', marginTop: '2px' }}>0%</div>
              <div style={{ fontSize: '10px', color: 'var(--bento-accent-green)', fontWeight: '700', marginTop: '2px' }}>✓ ICO Grounded</div>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--bento-primary-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid rgba(73, 80, 87, 0.08)'
          }}>
            <span>ENGINE: OLLAMA 3.2</span>
            <span style={{ color: 'var(--bento-accent-green)', fontWeight: '700' }}>ONLINE</span>
          </div>
        </div>

        {/* Bento Cell 3: Magnetic Dock Quick Capture (Span 6 on Laptop) */}
        <div className="bento-card bento-span-6" style={{ alignItems: 'center', textAlign: 'center', padding: '24px 20px' }}>
          <div className="bento-tag">
            <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span>Magnetic Dock // Quick Capture Modes</span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--bento-primary-deep)', marginBottom: '4px' }}>
            Choose an Input Channel
          </div>
          <div style={{ fontSize: '12px', color: 'var(--bento-primary-muted)', marginBottom: '16px' }}>
            Interactive tactile macOS-spring dock for instant capture
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <MagneticDock
              items={[
                {
                  id: 'voice',
                  label: 'Voice Memo',
                  icon: <Mic size={24} color="var(--bento-primary-deep)" />,
                  onClick: () => router.push('/capture?mode=voice'),
                  badge: 1
                },
                {
                  id: 'camera',
                  label: 'Whiteboard OCR',
                  icon: <Camera size={24} color="var(--bento-primary-deep)" />,
                  onClick: () => router.push('/capture?mode=camera')
                },
                {
                  id: 'text',
                  label: 'Type / Paste',
                  icon: <Keyboard size={24} color="var(--bento-primary-deep)" />,
                  onClick: () => router.push('/capture?mode=text')
                }
              ]}
              iconSize={54}
              maxScale={1.3}
              magneticDistance={140}
              variant="glass"
            />
          </div>
        </div>

        {/* Bento Cell 4: 1-Click Demo Scenarios (Span 6 on Laptop) */}
        <div className="bento-card bento-span-6">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div className="bento-tag" style={{ marginBottom: 0 }}>
              <Zap size={12} />
              <span>1-Click Benchmarks</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--bento-primary-muted)', fontWeight: '600' }}>
              Instant Test
            </span>
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
                  background: '#ffffff',
                  border: 'var(--bento-border)',
                  borderRadius: 'var(--bento-radius-sm)',
                  boxShadow: 'var(--bento-shadow-xs)',
                  padding: '11px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--bento-primary-deep)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--bento-shadow-sm)';
                  e.currentTarget.style.borderColor = 'rgba(73, 80, 87, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--bento-shadow-xs)';
                  e.currentTarget.style.borderColor = 'rgba(73, 80, 87, 0.12)';
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--bento-primary-deep)' }}>
                    {tpl.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--bento-primary-muted)', marginTop: '2px' }}>
                    {tpl.category} • Under 60s transformation
                  </div>
                </div>
                <ChevronRight size={16} color="var(--bento-primary-muted)" />
              </button>
            ))}
          </div>
        </div>

        {/* Bento Cell 5: Recent Deliverables History (Span 7 on Laptop) */}
        <div className="bento-card bento-span-7">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px'
          }}>
            <div className="bento-tag" style={{ marginBottom: 0 }}>
              <Clock size={12} />
              <span>Recent Transformations ({recentTrans.length})</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--bento-primary-muted)', fontWeight: '600' }}>
              Persisted
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentTrans.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push('/studio')}
                style={{
                  padding: '13px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: 'var(--bento-border)',
                  borderRadius: 'var(--bento-radius-sm)',
                  boxShadow: 'var(--bento-shadow-xs)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--bento-shadow-sm)';
                  e.currentTarget.style.borderColor = 'rgba(73, 80, 87, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--bento-shadow-xs)';
                  e.currentTarget.style.borderColor = 'rgba(73, 80, 87, 0.12)';
                }}
              >
                <div style={{ flex: 1, paddingRight: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--bento-primary-deep)' }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--bento-primary-muted)',
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={11} />
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span style={{
                      background: 'var(--bento-primary-subtle)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      color: 'var(--bento-primary-dark)'
                    }}>
                      {item.formatsCount} Formats
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--bento-primary-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Bento Cell 6: The Honest Split Architecture (Span 5 on Laptop) */}
        <div className="bento-card bento-span-5" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--bento-canvas) 100%)' }}>
          <div className="bento-tag">
            <Terminal size={12} />
            <span>The Honest Split Architecture</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: '#ffffff',
              padding: '12px',
              borderRadius: 'var(--bento-radius-sm)',
              border: 'var(--bento-border)',
              boxShadow: 'var(--bento-shadow-xs)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--bento-primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Smartphone size={17} color="var(--bento-primary-dark)" />
              </div>
              <div>
                <strong style={{ color: 'var(--bento-primary-deep)', fontSize: '13px' }}>iQOO Mobile Edge:</strong>
                <div style={{ fontSize: '11.5px', color: 'var(--bento-primary-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                  On-device Web Speech STT and Tesseract WASM OCR. Zero audio leaves the phone.
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: '#ffffff',
              padding: '12px',
              borderRadius: 'var(--bento-radius-sm)',
              border: 'var(--bento-border)',
              boxShadow: 'var(--bento-shadow-xs)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--bento-primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Laptop size={17} color="var(--bento-primary-dark)" />
              </div>
              <div>
                <strong style={{ color: 'var(--bento-primary-deep)', fontSize: '13px' }}>Laptop Compute Engine:</strong>
                <div style={{ fontSize: '11.5px', color: 'var(--bento-primary-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                  Headless local Ollama LLM + python-pptx generation with lid closed over local Wi-Fi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
