'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic, Camera, Keyboard, Sparkles, ArrowLeft, Loader2, Trash2,
  Sliders, ShieldAlert, Cpu, Check
} from 'lucide-react';
import Link from 'next/link';
import VoiceRecorder from '../../components/VoiceRecorder';
import OCRScanner from '../../components/OCRScanner';
import FormatSelector from '../../components/FormatSelector';
import { transformContent } from '../../lib/api';
import { MagneticDock } from '../../components/ui/magnetic-dock';

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

    // Check pre-filled text from session
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

      // Cache result for Studio screen and history
      sessionStorage.setItem('transformai_active_result', JSON.stringify(result));

      // Persist to recent history
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

      // Navigate to Studio (Screen 3)
      router.push('/studio');
    } catch (err) {
      console.error('Transform error:', err);
      setErrorMsg(err.message || 'Failed to complete transformation. Ensure backend is running.');
      setIsTransforming(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Top Breadcrumb & Step Tracker */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid var(--nb-black)',
        paddingBottom: '10px'
      }}>
        <Link
          href="/"
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <span style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          fontWeight: '800',
          background: 'var(--nb-yellow)',
          color: '#ffffff',
          border: '1.5px solid var(--nb-black)',
          boxShadow: '1.5px 1.5px 0px var(--nb-black)',
          padding: '4px 10px',
          borderRadius: '4px'
        }}>
          STEP 1 OF 2 // RAW CAPTURE
        </span>
      </div>

      {/* 2-Column Responsive Workspace Grid (Laptop: Left/Right, Mobile: Stacked) */}
      <div className="capture-layout-grid">
        {/* Left Column: Input Modes & Raw Telemetry Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Input Mode Selector Bar */}
          <div className="card" style={{ padding: '12px 16px' }}>
            <div style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '800',
              color: 'var(--nb-black)',
              textTransform: 'uppercase',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>1. Choose Capture Channel</span>
              <span style={{ color: 'var(--nb-text-muted)' }}>Edge WASM / Web Speech</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--nb-black)',
                  boxShadow: inputMode === 'voice' ? '3px 3px 0px var(--nb-black)' : '1px 1px 0px var(--nb-black)',
                  background: inputMode === 'voice' ? 'var(--nb-yellow)' : '#fff',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '13px',
                  color: inputMode === 'voice' ? '#ffffff' : 'var(--nb-black)',
                  transition: 'all 0.1s ease',
                  transform: inputMode === 'voice' ? 'translate(-1px, -1px)' : 'none'
                }}
              >
                <Mic size={22} />
                <span>Voice Memo</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('camera')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--nb-black)',
                  boxShadow: inputMode === 'camera' ? '3px 3px 0px var(--nb-black)' : '1px 1px 0px var(--nb-black)',
                  background: inputMode === 'camera' ? 'var(--nb-yellow)' : '#fff',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '13px',
                  color: inputMode === 'camera' ? '#ffffff' : 'var(--nb-black)',
                  transition: 'all 0.1s ease',
                  transform: inputMode === 'camera' ? 'translate(-1px, -1px)' : 'none'
                }}
              >
                <Camera size={22} />
                <span>Whiteboard OCR</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('text')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--nb-black)',
                  boxShadow: inputMode === 'text' ? '3px 3px 0px var(--nb-black)' : '1px 1px 0px var(--nb-black)',
                  background: inputMode === 'text' ? 'var(--nb-yellow)' : '#fff',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '13px',
                  color: inputMode === 'text' ? '#ffffff' : 'var(--nb-black)',
                  transition: 'all 0.1s ease',
                  transform: inputMode === 'text' ? 'translate(-1px, -1px)' : 'none'
                }}
              >
                <Keyboard size={22} />
                <span>Type / Paste</span>
              </button>
            </div>
          </div>

          {/* Active Input Mode Component */}
          {inputMode === 'voice' && (
            <VoiceRecorder onTranscriptUpdate={setRawText} currentText={rawText} />
          )}

          {inputMode === 'camera' && (
            <OCRScanner onOCRComplete={(txt) => setRawText((prev) => (prev ? prev + '\n\n' + txt : txt))} />
          )}

          {/* Raw Telemetry & Editable Text Area */}
          <div className="card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="card-badge-header" style={{ marginBottom: 0 }}>
                  Raw Telemetry Stream
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '800',
                  color: 'var(--nb-black)',
                  background: '#fff',
                  border: '1px solid var(--nb-black)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {rawText.length} Chars
                </span>
              </div>

              {rawText && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  style={{
                    background: '#fee2e2',
                    border: '1.5px solid var(--nb-black)',
                    boxShadow: '1px 1px 0px var(--nb-black)',
                    borderRadius: '4px',
                    color: '#991b1b',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px'
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
                background: 'var(--nb-yellow-50)',
                border: '2px solid var(--nb-black)',
                borderRadius: '8px',
                color: 'var(--nb-black)',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.05)'
              }}
            />
          </div>
        </div>

        {/* Right Column: Format Selector & Transform Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Format Selector Component */}
          <div className="card">
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
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#fee2e2',
              border: '2px solid var(--nb-black)',
              boxShadow: '3px 3px 0px var(--nb-black)',
              color: '#991b1b',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Prominent Neobrutalist Transform Trigger Button */}
          <div style={{ position: 'sticky', bottom: '16px', zIndex: 30 }}>
            <button
              type="button"
              onClick={handleTransform}
              disabled={isTransforming}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '18px 24px',
                fontSize: '16px',
                fontWeight: '900',
                letterSpacing: '0.5px',
                boxShadow: '5px 5px 0px var(--nb-black)'
              }}
            >
              {isTransforming ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  <span>TRANSFORMING VIA HEADLESS ENGINE...</span>
                </>
              ) : (
                <>
                  <Sparkles size={22} />
                  <span>TRANSFORM DELIVERABLES ({formats.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaptureScreen() {
  return (
    <Suspense fallback={
      <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 size={36} className="animate-spin" color="var(--nb-black)" />
      </div>
    }>
      <CaptureContent />
    </Suspense>
  );
}
