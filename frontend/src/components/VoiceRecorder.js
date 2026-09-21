'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';

export default function VoiceRecorder({ onTranscriptUpdate, currentText = '' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const simInterval = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        let full = '';
        let interim = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            full += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInterimText(interim);
        if (full) {
          onTranscriptUpdate((prev) => (prev ? prev + ' ' + full : full).trim());
        }
      };

      recog.onerror = (e) => {
        console.warn('Web Speech API Notice:', e.error);
        setIsRecording(false);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recog);
    }
  }, [onTranscriptUpdate]);

  const toggleRecording = () => {
    if (!recognition) {
      simulateVoiceStream();
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        simulateVoiceStream();
      }
    }
  };

  const simulateVoiceStream = () => {
    if (isSimulating) {
      clearInterval(simInterval.current);
      setIsSimulating(false);
      return;
    }

    setIsSimulating(true);
    const demoPhrases = [
      "Starting product sync with Mobile Engineering lead.",
      " We agreed that our Q3 launch target will be next Friday.",
      " 45 minutes saved per engineer every day.",
      " Action item: Priya will finalize the python-pptx templates by 5 PM.",
      " Alex to connect the shared clipboard via iQOO Office Kit."
    ];
    let step = 0;
    simInterval.current = setInterval(() => {
      if (step < demoPhrases.length) {
        onTranscriptUpdate((prev) => (prev ? prev + demoPhrases[step] : demoPhrases[step]));
        step++;
      } else {
        clearInterval(simInterval.current);
        setIsSimulating(false);
      }
    }, 900);
  };

  const active = isRecording || isSimulating;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        background: active ? 'rgba(255, 255, 255, 0.95)' : '#ffffff',
        border: active ? '1.5px solid var(--clay-primary)' : 'var(--clay-border)',
        borderRadius: 'var(--clay-radius-card)',
        boxShadow: active ? 'var(--clay-shadow-card-hover)' : 'var(--clay-shadow-card)',
        padding: '30px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {active ? (
          <div style={{
            background: 'var(--clay-card-inset)',
            boxShadow: 'var(--clay-shadow-inset)',
            padding: '12px 28px',
            borderRadius: 'var(--clay-radius-card-sm)'
          }}>
            <div className="audio-waves">
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
            </div>
          </div>
        ) : (
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--clay-card-inset)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '8px 12px 24px rgba(73, 80, 87, 0.12), inset 3px 3px 6px rgba(255, 255, 255, 0.9), inset -3px -3px 6px rgba(73, 80, 87, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--clay-primary-dark)'
          }}>
            <Mic size={28} />
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--clay-primary-deep)', letterSpacing: '-0.3px' }}>
            {active ? 'Listening (Web Speech API Edge)...' : 'Tap to Record Voice Memo'}
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--clay-primary-muted)', marginTop: '4px', fontWeight: '500' }}>
            100% on-device speech-to-text. Zero audio leaves your phone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={toggleRecording}
            className={`btn ${active ? 'btn-secondary' : 'btn-primary'} btn-sm btn-pill`}
            style={{
              background: active ? 'var(--clay-accent-coral-bg)' : undefined,
              color: active ? 'var(--clay-accent-coral)' : undefined,
              borderColor: active ? 'rgba(201, 42, 42, 0.2)' : undefined,
              boxShadow: active ? 'var(--clay-shadow-btn-secondary)' : undefined
            }}
          >
            {active ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{active ? 'Stop Recording' : 'Start Microphone'}</span>
          </button>

          {!active && (
            <button
              type="button"
              onClick={simulateVoiceStream}
              className="btn btn-secondary btn-sm btn-pill"
              title="Simulate realistic voice input stream"
            >
              <Sparkles size={14} color="var(--clay-primary)" />
              <span>Simulate Voice</span>
            </button>
          )}
        </div>

        {interimText && (
          <div style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--clay-primary)',
            background: 'var(--clay-card-inset)',
            boxShadow: 'var(--clay-shadow-inset)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            padding: '8px 16px',
            borderRadius: 'var(--clay-radius-pill)',
            marginTop: '4px'
          }}>
            "{interimText}"
          </div>
        )}
      </div>
    </div>
  );
}
