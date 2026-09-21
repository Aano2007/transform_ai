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
        padding: '4px 0 12px 0'
      }}>
        <Link
          href="/"
          className="btn btn-secondary btn-sm btn-pill"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Overview</span>
        </Link>

        <div className="bento-tag" style={{ marginBottom: 0 }}>
          <Activity size={12} />
          <span>Step 1 of 2 // Raw Capture</span>
        </div>
      </div>

      {/* 2-Column Bento Workspace Grid (Laptop: 7/5 cols, Mobile: Stacked) */}
      <div className="bento-grid">
        {/* Left Bento Column: Input Modes & Raw Telemetry Stream (7 cols on laptop) */}
        <div className="bento-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Capture Channel Switcher Card */}
          <div className="bento-card" style={{ padding: '16px 20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--bento-primary-deep)' }}>
                1. Choose Capture Channel
              </span>
              <span style={{ fontSize: '11px', color: 'var(--bento-primary-muted)', fontFamily: 'var(--font-mono)' }}>
                Edge WASM / Web Speech
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              background: 'var(--bento-primary-subtle)',
              padding: '4px',
              borderRadius: 'var(--bento-radius-md)'
            }}>
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: 'var(--bento-radius-sm)',
                  border: 'none',
                  background: inputMode === 'voice' ? '#ffffff' : 'transparent',
                  boxShadow: inputMode === 'voice' ? 'var(--bento-shadow-xs)' : 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: inputMode === 'voice' ? 'var(--bento-primary-deep)' : 'var(--bento-primary-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Mic size={16} />
                <span>Voice</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('camera')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: 'var(--bento-radius-sm)',
                  border: 'none',
                  background: inputMode === 'camera' ? '#ffffff' : 'transparent',
                  boxShadow: inputMode === 'camera' ? 'var(--bento-shadow-xs)' : 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: inputMode === 'camera' ? 'var(--bento-primary-deep)' : 'var(--bento-primary-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Camera size={16} />
                <span>OCR</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('text')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: 'var(--bento-radius-sm)',
                  border: 'none',
                  background: inputMode === 'text' ? '#ffffff' : 'transparent',
                  boxShadow: inputMode === 'text' ? 'var(--bento-shadow-xs)' : 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: inputMode === 'text' ? 'var(--bento-primary-deep)' : 'var(--bento-primary-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Keyboard size={16} />
                <span>Text</span>
              </button>
            </div>
          </div>

          {/* Active Input Channel Component */}
          {inputMode === 'voice' && (
            <VoiceRecorder onTranscriptUpdate={setRawText} currentText={rawText} />
          )}

          {inputMode === 'camera' && (
            <OCRScanner onOCRComplete={(txt) => setRawText((prev) => (prev ? prev + '\n\n' + txt : txt))} />
          )}

          {/* Raw Telemetry & Note Area */}
          <div className="bento-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--bento-primary-deep)' }}>
                  Live Telemetry Stream
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--bento-primary-muted)',
                  background: 'var(--bento-primary-subtle)',
                  padding: '2px 8px',
                  borderRadius: 'var(--bento-radius-full)',
                  fontWeight: '600'
                }}>
                  {rawText.length} Chars
                </span>
              </div>

              {rawText && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  style={{
                    background: 'var(--bento-accent-coral-bg)',
                    border: '1px solid rgba(224, 49, 49, 0.2)',
                    borderRadius: 'var(--bento-radius-full)',
                    color: 'var(--bento-accent-coral)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px'
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
                background: 'var(--bento-primary-subtle)',
                border: '1px solid rgba(73, 80, 87, 0.12)',
                borderRadius: 'var(--bento-radius-md)',
                color: 'var(--bento-primary-deep)',
                padding: '14px 16px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--bento-primary)';
                e.target.style.boxShadow = 'var(--bento-shadow-focus)';
                e.target.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(73, 80, 87, 0.12)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'var(--bento-primary-subtle)';
              }}
            />
          </div>
        </div>

        {/* Right Bento Column: Target Format Selectors & CTA (5 cols on laptop) */}
        <div className="bento-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              padding: '12px 16px',
              borderRadius: 'var(--bento-radius-sm)',
              background: 'var(--bento-accent-coral-bg)',
              border: '1px solid rgba(224, 49, 49, 0.2)',
              color: 'var(--bento-accent-coral)',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bento Transform Trigger Button */}
          <button
            type="button"
            onClick={handleTransform}
            disabled={isTransforming}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '18px 24px',
              fontSize: '15px',
              fontWeight: '800',
              borderRadius: 'var(--bento-radius-md)',
              boxShadow: '0 8px 25px rgba(73, 80, 87, 0.28)'
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
        <Loader2 size={32} className="animate-spin" color="var(--bento-primary)" />
      </div>
    }>
      <CaptureContent />
    </Suspense>
  );
}
