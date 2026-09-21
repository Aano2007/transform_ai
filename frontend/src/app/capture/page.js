'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic, Camera, Keyboard, Sparkles, ArrowLeft, Loader2, Trash2,
  Sliders, ShieldAlert, Cpu
} from 'lucide-react';
import Link from 'next/link';
import VoiceRecorder from '../../components/VoiceRecorder';
import OCRScanner from '../../components/OCRScanner';
import FormatSelector from '../../components/FormatSelector';
import { transformContent } from '../../lib/api';
import { MagneticDock } from '../../components/ui/magnetic-dock';
import { BorderBeam } from 'border-beam';

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
  const [beamVariant, setBeamVariant] = useState('colorful');
  const [beamSize, setBeamSize] = useState('md');
  const [beamStrength, setBeamStrength] = useState(0.7);
  const [beamActive, setBeamActive] = useState(true);

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
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>

        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--iqoo-cyan)' }}>
          STEP 1 OF 2 // CAPTURE
        </span>
      </div>

      {/* Magnetic Dock Input Mode Switcher */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        margin: '2px 0 6px 0'
      }}>
        <MagneticDock
          items={[
            {
              id: 'voice',
              label: 'Voice Memo',
              icon: <Mic size={24} color={inputMode === 'voice' ? 'var(--iqoo-orange)' : 'var(--text-muted)'} />,
              isActive: inputMode === 'voice',
              onClick: () => setInputMode('voice')
            },
            {
              id: 'camera',
              label: 'Scan OCR',
              icon: <Camera size={24} color={inputMode === 'camera' ? 'var(--iqoo-cyan)' : 'var(--text-muted)'} />,
              isActive: inputMode === 'camera',
              onClick: () => setInputMode('camera')
            },
            {
              id: 'text',
              label: 'Type / Paste',
              icon: <Keyboard size={24} color={inputMode === 'text' ? 'var(--iqoo-purple)' : 'var(--text-muted)'} />,
              isActive: inputMode === 'text',
              onClick: () => setInputMode('text')
            }
          ]}
          iconSize={50}
          maxScale={1.4}
          magneticDistance={140}
          variant="glass"
        />
      </div>

      {/* Input Mode Component Area */}
      {inputMode === 'voice' && (
        <VoiceRecorder onTranscriptUpdate={setRawText} currentText={rawText} />
      )}

      {inputMode === 'camera' && (
        <OCRScanner onOCRComplete={(txt) => setRawText((prev) => (prev ? prev + '\n\n' + txt : txt))} />
      )}

      {/* Live Input & Transcript Preview Box with Libraries.dev BorderBeam */}
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
            <label style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Raw Input Telemetry ({rawText.length} chars)
            </label>

            {/* Beam effect indicator pill */}
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              background: beamActive ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              border: beamActive ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid var(--border-subtle)',
              color: beamActive ? 'var(--iqoo-cyan)' : 'var(--text-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: beamActive ? 'var(--iqoo-cyan)' : 'var(--text-dim)',
                boxShadow: beamActive ? '0 0 6px var(--iqoo-cyan)' : 'none'
              }} />
              BEAM: {beamVariant.toUpperCase()} ({beamSize})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Color Variant switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(5, 8, 16, 0.7)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              padding: '2px'
            }}>
              {['colorful', 'ocean', 'sunset', 'mono'].map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => setBeamVariant(variant)}
                  title={`Beam color: ${variant}`}
                  style={{
                    background: beamVariant === variant ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: beamVariant === variant ? '#fff' : 'var(--text-dim)',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 5px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {variant}
                </button>
              ))}
            </div>

            {/* Clear Button */}
            {rawText && (
              <button
                type="button"
                onClick={() => setRawText('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px'
                }}
              >
                <Trash2 size={12} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Libraries.dev BorderBeam wrapping textarea */}
        <BorderBeam
          size={beamSize}
          colorVariant={beamVariant}
          strength={beamStrength}
          active={beamActive}
          theme="dark"
          borderRadius={10}
          style={{ width: '100%' }}
        >
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={
              inputMode === 'voice'
                ? 'Voice transcript will stream here live...'
                : inputMode === 'camera'
                ? 'OCR scanned text from whiteboard will appear here...'
                : 'Paste rough notes, meeting takeaways, or quick thoughts here...'
            }
            style={{
              width: '100%',
              display: 'block',
              background: 'rgba(5, 8, 16, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: '#fff',
              padding: '12px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.5',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </BorderBeam>
      </div>

      {/* Format Selector Component */}
      <FormatSelector
        selectedFormats={formats}
        onChangeFormats={setFormats}
        tone={tone}
        onChangeTone={setTone}
        audience={audience}
        onChangeAudience={setAudience}
      />

      {errorMsg && (
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldAlert size={16} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Prominent TRANSFORM Trigger Button */}
      <div style={{ position: 'sticky', bottom: '16px', zIndex: 30 }}>
        <button
          type="button"
          onClick={handleTransform}
          disabled={isTransforming}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '16px',
            fontWeight: '900',
            letterSpacing: '0.5px'
          }}
        >
          {isTransforming ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>TRANSFORMING VIA HEADLESS COMPUTE...</span>
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
  );
}

export default function CaptureScreen() {
  return (
    <Suspense fallback={
      <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="var(--iqoo-orange)" />
      </div>
    }>
      <CaptureContent />
    </Suspense>
  );
}
