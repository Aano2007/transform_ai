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
    // Auth Check
    const token = localStorage.getItem('transformai_token');
    if (!token) {
      router.push('/login');
      return;
    }

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

  const handleLogout = () => {
    localStorage.removeItem('transformai_token');
    router.push('/login');
  };

  return (
    <div className="content-wrapper relative">
      <button 
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-slate-800 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg z-50"
      >
        Logout
      </button>
      {/* 12-Column Responsive Claymorphism Grid */}
      <div className="bento-grid">
        {/* Clay Cell 1: 3D Inflated Hero Banner (Span 8 on Laptop) */}
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
            color: 'var(--clay-primary-deep)',
            marginBottom: '12px'
          }}>
            Capture Raw.{' '}
            <span style={{
              background: 'linear-gradient(145deg, #495057, #212529)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Deliver Polished.
            </span>
          </h1>

          <p style={{
            fontSize: '15px',
            color: 'var(--clay-text-muted)',
            maxWidth: '520px',
            lineHeight: '1.6',
            fontWeight: '500',
            marginBottom: '22px'
          }}>
            One voice memo → 4 boardroom-ready deliverables in under 60 seconds.
            Zero prompt engineering. Powered by The Honest Split hardware architecture.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              href="/capture"
              className="btn btn-primary btn-pill"
              style={{ padding: '14px 30px', fontSize: '15px' }}
            >
              <Sparkles size={17} />
              <span>+ Start Transformation</span>
            </Link>

            <Link
              href="/slides"
              className="btn btn-secondary btn-pill"
              style={{ padding: '14px 24px', fontSize: '14px' }}
            >
              <Presentation size={16} />
              <span>Presentation Deck</span>
            </Link>
          </div>
        </div>

        {/* Clay Cell 2: 3D Hardware Telemetry Meter (Span 4 on Laptop) */}
        <div className="bento-card bento-span-4" style={{
          background: 'linear-gradient(145deg, #ffffff, #f7f9fd)',
          justifyContent: 'space-between'
        }}>
          <div>
            <div className="bento-tag" style={{ background: 'var(--clay-accent-green-bg)', color: 'var(--clay-accent-green)' }}>
              <Activity size={13} />
              <span>Edge Telemetry</span>
            </div>

            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--clay-primary-deep)' }}>
              iQOO Compute Engine
            </div>
            <div style={{ fontSize: '12px', color: 'var(--clay-primary-muted)', marginTop: '2px' }}>
              Headless local inference over Wi-Fi
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '20px 0' }}>
            <div style={{
              background: 'var(--clay-card-inset)',
              boxShadow: 'var(--clay-shadow-inset)',
              borderRadius: 'var(--clay-radius-inner)',
              padding: '14px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: '700' }}>SLA Latency</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--clay-primary-deep)', marginTop: '3px' }}>&lt;60s</div>
              <div style={{ fontSize: '10px', color: 'var(--clay-accent-green)', fontWeight: '800', marginTop: '2px' }}>⚡ Real-time</div>
            </div>

            <div style={{
              background: 'var(--clay-card-inset)',
              boxShadow: 'var(--clay-shadow-inset)',
              borderRadius: 'var(--clay-radius-inner)',
              padding: '14px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: '700' }}>Hallucination</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--clay-primary-deep)', marginTop: '3px' }}>0%</div>
              <div style={{ fontSize: '10px', color: 'var(--clay-accent-green)', fontWeight: '800', marginTop: '2px' }}>✓ Grounded</div>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--clay-primary-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid rgba(73, 80, 87, 0.08)'
          }}>
            <span>ENGINE: OLLAMA 3.2</span>
            <span style={{ color: 'var(--clay-accent-green)', fontWeight: '800' }}>ACTIVE</span>
          </div>
        </div>

        {/* Clay Cell 3: 3D Magnetic Capture Dock (Span 6 on Laptop) */}
        <div className="bento-card bento-span-6" style={{ alignItems: 'center', textAlign: 'center', padding: '28px 22px' }}>
          <div className="bento-tag">
            <span className="pulse-dot" style={{ width: '7px', height: '7px' }} />
            <span>Magnetic Dock // Quick Capture Modes</span>
          </div>

          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--clay-primary-deep)', marginBottom: '4px' }}>
            Choose an Input Channel
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--clay-text-muted)', marginBottom: '18px' }}>
            Interactive tactile macOS-spring dock with 3D clay buttons
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <MagneticDock
              items={[
                {
                  id: 'voice',
                  label: 'Voice Memo',
                  icon: <Mic size={24} color="var(--clay-primary-deep)" />,
                  onClick: () => router.push('/capture?mode=voice'),
                  badge: 1
                },
                {
                  id: 'camera',
                  label: 'Whiteboard OCR',
                  icon: <Camera size={24} color="var(--clay-primary-deep)" />,
                  onClick: () => router.push('/capture?mode=camera')
                },
                {
                  id: 'text',
                  label: 'Type / Paste',
                  icon: <Keyboard size={24} color="var(--clay-primary-deep)" />,
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

        {/* Clay Cell 4: 1-Click Demo Scenarios (Span 6 on Laptop) */}
        <div className="bento-card bento-span-6">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px'
          }}>
            <div className="bento-tag" style={{ marginBottom: 0 }}>
              <Zap size={12} />
              <span>1-Click Benchmarks</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: '700' }}>
              Instant Test
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
                  background: '#ffffff',
                  border: 'var(--clay-border-subtle)',
                  borderRadius: 'var(--clay-radius-inner)',
                  boxShadow: 'var(--clay-shadow-btn-secondary)',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--clay-primary-deep)',
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '10px 14px 28px rgba(73, 80, 87, 0.14), inset 3px 3px 6px rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '6px 10px 20px rgba(73, 80, 87, 0.08), inset 3px 3px 6px rgba(255, 255, 255, 0.95)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px) scale(0.99)';
                  e.currentTarget.style.boxShadow = 'var(--clay-shadow-inset)';
                  e.currentTarget.style.background = 'var(--clay-card-inset)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--clay-primary-deep)' }}>
                    {tpl.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--clay-text-muted)', marginTop: '2px', fontWeight: '600' }}>
                    {tpl.category} • Under 60s transformation
                  </div>
                </div>
                <ChevronRight size={17} color="var(--clay-primary-muted)" />
              </button>
            ))}
          </div>
        </div>

        {/* Clay Cell 5: Recent Deliverables History (Span 7 on Laptop) */}
        <div className="bento-card bento-span-7">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div className="bento-tag" style={{ marginBottom: 0 }}>
              <Clock size={12} />
              <span>Recent Transformations ({recentTrans.length})</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: '700' }}>
              Persisted
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentTrans.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push('/studio')}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: 'var(--clay-border-subtle)',
                  borderRadius: 'var(--clay-radius-inner)',
                  boxShadow: 'var(--clay-shadow-btn-secondary)',
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '10px 14px 28px rgba(73, 80, 87, 0.14), inset 3px 3px 6px rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '6px 10px 20px rgba(73, 80, 87, 0.08), inset 3px 3px 6px rgba(255, 255, 255, 0.95)';
                }}
              >
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--clay-primary-deep)' }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--clay-primary-muted)',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Clock size={12} />
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span style={{
                      background: 'var(--clay-card-inset)',
                      boxShadow: 'var(--clay-shadow-inset)',
                      padding: '2px 8px',
                      borderRadius: 'var(--clay-radius-pill)',
                      fontWeight: '800',
                      color: 'var(--clay-primary-dark)'
                    }}>
                      {item.formatsCount} Deliverables
                    </span>
                  </div>
                </div>
                <ChevronRight size={17} color="var(--clay-primary-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Clay Cell 6: The Honest Split Architecture (Span 5 on Laptop) */}
        <div className="bento-card bento-span-5" style={{ background: 'linear-gradient(145deg, #ffffff, #f7f9fd)' }}>
          <div className="bento-tag">
            <Terminal size={12} />
            <span>The Honest Split Architecture</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: '#ffffff',
              padding: '14px',
              borderRadius: 'var(--clay-radius-inner)',
              border: 'var(--clay-border-subtle)',
              boxShadow: 'var(--clay-shadow-btn-secondary)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--clay-card-inset)',
                boxShadow: 'var(--clay-shadow-inset)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Smartphone size={18} color="var(--clay-primary-dark)" />
              </div>
              <div>
                <strong style={{ color: 'var(--clay-primary-deep)', fontSize: '13.5px' }}>iQOO Mobile Edge:</strong>
                <div style={{ fontSize: '12px', color: 'var(--clay-text-muted)', marginTop: '2px', lineHeight: 1.45 }}>
                  On-device Web Speech STT and Tesseract WASM OCR. Zero audio leaves your phone.
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: '#ffffff',
              padding: '14px',
              borderRadius: 'var(--clay-radius-inner)',
              border: 'var(--clay-border-subtle)',
              boxShadow: 'var(--clay-shadow-btn-secondary)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--clay-card-inset)',
                boxShadow: 'var(--clay-shadow-inset)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Laptop size={18} color="var(--clay-primary-dark)" />
              </div>
              <div>
                <strong style={{ color: 'var(--clay-primary-deep)', fontSize: '13.5px' }}>Laptop Compute Engine:</strong>
                <div style={{ fontSize: '12px', color: 'var(--clay-text-muted)', marginTop: '2px', lineHeight: 1.45 }}>
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
