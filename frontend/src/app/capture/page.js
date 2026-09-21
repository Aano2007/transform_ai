'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic, Camera, Keyboard, Sparkles, ArrowLeft, Loader2, Trash2,
  Sliders, ShieldAlert, Cpu, Check, Activity
} from 'lucide-react';
import Link from 'next/link';
import VoiceRecorder from '../../components/VoiceRecorder';
import OCRScanner from '../../components/OCRScanner';
import FormatSelector from '../../components/FormatSelector';
import { AppleSwitch } from '../../components/unlumen-ui/apple-switch';
import { transformContent } from '../../lib/api';

function CaptureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputMode, setInputMode] = useState('voice');
  const [rawText, setRawText] = useState('');
  const [formats, setFormats] = useState(['executive_summary', 'presentation', 'linkedin', 'twitter']);
  const [tone, setTone] = useState('professional');
  const [audience, setAudience] = useState('executive');
  const [isTransforming, setIsTransforming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const initialMode = searchParams.get('mode');
    if (initialMode && ['voice', 'camera', 'text'].includes(initialMode)) {
      setInputMode(initialMode);
    }

    const prefill = sessionStorage.getItem('transformai_prefill_text');
    if (prefill) {
      setRawText(prefill);
      sessionStorage.removeItem('transformai_prefill_text');
    }

    const prefillMode = sessionStorage.getItem('transformai_prefill_mode');
    if (prefillMode) {
      setInputMode(prefillMode);
      sessionStorage.removeItem('transformai_prefill_mode');
    }
  }, [searchParams]);

  const handleTransform = async () => {
    if (!rawText.trim()) {
      setErrorMsg('Please record speech, scan a whiteboard, or enter text first.');
      return;
    }

    setErrorMsg('');
    setIsTransforming(true);

    try {
      const result = await transformContent({
        raw_text: rawText,
        formats,
        tone,
        audience
      });

      sessionStorage.setItem('transformai_active_result', JSON.stringify(result));

      try {
        const storedHistory = JSON.parse(localStorage.getItem('transformai_history') || '[]');
        const newHistoryItem = {
          id: 'hist_' + Date.now(),
          title: result.ico?.event_title || 'Recent Transformation',
          timestamp: 'Just now',
          formatsCount: Object.keys(result.outputs || {}).length,
          primaryObjective: result.ico?.primary_objective || 'Transform deliverable'
        };
        localStorage.setItem(
          'transformai_history',
          JSON.stringify([newHistoryItem, ...storedHistory].slice(0, 5))
        );
      } catch (e) {}

      router.push('/studio');
    } catch (err) {
      console.error('Transform error:', err);
      setErrorMsg(err.message || 'Failed to complete transformation. Ensure backend is running.');
      setIsTransforming(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Top Header & Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0 16px 0'
      }}>
        <Link
          href="/"
          className="btn btn-secondary btn-sm btn-pill"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Overview</span>
        </Link>

        <div className="clay-pill" style={{ marginBottom: 0 }}>
          <Activity size={12} />
          <span>Step 1 of 2 // Raw Capture</span>
        </div>
      </div>

      {/* 2-Column Clay Workspace Grid (Laptop: 7/5 cols, Mobile: Stacked) */}
      <div className="bento-grid">
        {/* Left Column: Input Modes & Raw Telemetry Stream (7 cols on laptop) */}
        <div className="bento-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Capture Channel Switcher Card with Apple Switch */}
          <div className="bento-card" style={{ padding: '18px 22px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--clay-primary-deep)', letterSpacing: '-0.2px' }}>
                  1. Capture Channel Switch
                </span>
                <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: '500', marginTop: '1px' }}>
                  Flip the Apple Switch to activate channel
                </div>
              </div>
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--clay-primary)',
                background: 'var(--clay-card-inset)',
                boxShadow: 'var(--clay-shadow-inset)',
                padding: '4px 10px',
                borderRadius: 'var(--clay-radius-pill)',
                fontWeight: '800'
              }}>
                {inputMode.toUpperCase()} ACTIVE
              </span>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {[
                {
                  id: 'voice',
                  label: 'Voice Memo',
                  detail: 'Edge Web Speech STT',
                  icon: Mic,
                },
                {
                  id: 'camera',
                  label: 'Whiteboard OCR',
                  detail: 'On-device Tesseract.js WASM',
                  icon: Camera,
                },
                {
                  id: 'text',
                  label: 'Text / Raw Notes',
                  detail: 'Direct typing or paste stream',
                  icon: Keyboard,
                },
              ].map((ch) => {
                const isActive = inputMode === ch.id;
                const Icon = ch.icon;
                return (
                  <div
                    key={ch.id}
                    onClick={() => setInputMode(ch.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--clay-radius-inner)',
                      background: isActive ? '#ffffff' : 'var(--clay-card-inset)',
                      border: isActive ? '1.5px solid rgba(73, 80, 87, 0.18)' : '1px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: isActive
                        ? '6px 10px 22px rgba(73, 80, 87, 0.09), inset 2px 2px 4px rgba(255, 255, 255, 0.95), inset -2px -2px 4px rgba(73, 80, 87, 0.04)'
                        : 'var(--clay-shadow-inset)',
                      cursor: 'pointer',
                      transform: isActive ? 'translateY(-1px)' : 'none',
                      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '11px',
                        background: isActive ? 'var(--clay-primary)' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--clay-primary-dark)',
                        boxShadow: isActive
                          ? 'var(--clay-shadow-btn-primary)'
                          : 'var(--clay-shadow-btn-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '13.5px',
                          fontWeight: '800',
                          color: 'var(--clay-primary-deep)',
                          letterSpacing: '-0.2px'
                        }}>
                          {ch.label}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--clay-primary-muted)',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '500'
                        }}>
                          {ch.detail}
                        </div>
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
                      <AppleSwitch
                        size="sm"
                        checked={isActive}
                        onCheckedChange={(checked) => {
                          if (checked) setInputMode(ch.id);
                        }}
                        aria-label={`Switch to ${ch.label}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Input Channel Component */}
          {inputMode === 'voice' && (
            <VoiceRecorder onTranscriptUpdate={setRawText} currentText={rawText} />
          )}

          {inputMode === 'camera' && (
            <OCRScanner onOCRComplete={(txt) => setRawText((prev) => (prev ? prev + '\n\n' + txt : txt))} />
          )}

          {/* Raw Telemetry & Recessed Note Well */}
          <div className="bento-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--clay-primary-deep)' }}>
                  Live Telemetry Stream
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--clay-primary-muted)',
                  background: 'var(--clay-card-inset)',
                  boxShadow: 'var(--clay-shadow-inset)',
                  padding: '3px 10px',
                  borderRadius: 'var(--clay-radius-pill)',
                  fontWeight: '700'
                }}>
                  {rawText.length} Chars
                </span>
              </div>

              {rawText && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  style={{
                    background: 'var(--clay-accent-coral-bg)',
                    border: '1px solid rgba(201, 42, 42, 0.2)',
                    boxShadow: '2px 4px 10px rgba(201, 42, 42, 0.12), inset 1px 1px 2px rgba(255, 255, 255, 0.8)',
                    borderRadius: 'var(--clay-radius-pill)',
                    color: 'var(--clay-accent-coral)',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={
                inputMode === 'voice'
                  ? 'Voice transcript will stream here in real-time. Speak into microphone or tap Simulate...'
                  : inputMode === 'camera'
                  ? 'OCR transcribed text from whiteboard will appear here...'
                  : 'Type or paste rough meeting notes, voice transcripts, or raw bullet points here...'
              }
              style={{
                width: '100%',
                display: 'block',
                background: 'var(--clay-card-inset)',
                boxShadow: 'var(--clay-shadow-inset)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: 'var(--clay-radius-inner)',
                color: 'var(--clay-primary-deep)',
                padding: '16px 18px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--clay-primary)';
                e.target.style.boxShadow = '6px 10px 24px rgba(73, 80, 87, 0.1), inset 2px 2px 5px rgba(255, 255, 255, 1)';
                e.target.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                e.target.style.boxShadow = 'var(--clay-shadow-inset)';
                e.target.style.background = 'var(--clay-card-inset)';
              }}
            />
          </div>
        </div>

        {/* Right Column: Target Format Selectors & CTA (5 cols on laptop) */}
        <div className="bento-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Deliverables Format Selector */}
          <div className="bento-card">
            <FormatSelector
              selectedFormats={formats}
              onChangeFormats={setFormats}
              tone={tone}
              onChangeTone={setTone}
              audience={audience}
              onChangeAudience={setAudience}
            />
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              padding: '14px 18px',
              borderRadius: 'var(--clay-radius-inner)',
              background: 'var(--clay-accent-coral-bg)',
              boxShadow: 'var(--clay-shadow-btn-secondary)',
              border: '1px solid rgba(201, 42, 42, 0.2)',
              color: 'var(--clay-accent-coral)',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Claymorphic 3D Transform Trigger Button */}
          <button
            type="button"
            onClick={handleTransform}
            disabled={isTransforming}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '18px 24px',
              fontSize: '15px',
              fontWeight: '900',
              borderRadius: 'var(--clay-radius-inner)',
              letterSpacing: '0.3px'
            }}
          >
            {isTransforming ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>TRANSFORMING VIA HEADLESS ENGINE...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>TRANSFORM DELIVERABLES ({formats.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CaptureScreen() {
  return (
    <Suspense fallback={
      <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 size={32} className="animate-spin" color="var(--clay-primary)" />
      </div>
    }>
      <CaptureContent />
    </Suspense>
  );
}
