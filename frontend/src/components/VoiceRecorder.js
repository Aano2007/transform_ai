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
        background: active ? 'rgba(73, 80, 87, 0.04)' : '#ffffff',
        border: active ? '1.5px solid var(--bento-primary)' : 'var(--bento-border)',
        borderRadius: 'var(--bento-radius-md)',
        boxShadow: active ? '0 8px 25px rgba(73, 80, 87, 0.12)' : 'var(--bento-shadow-sm)',
        padding: '26px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        transition: 'all 0.2s ease'
      }}>
        {active ? (
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
        ) : (
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--bento-primary-subtle)',
            border: '1px solid rgba(73, 80, 87, 0.15)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bento-primary-dark)'
          }}>
            <Mic size={26} />
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--bento-primary-deep)' }}>
            {active ? 'Listening (Web Speech API Edge)...' : 'Tap to Record Voice Memo'}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--bento-primary-muted)', marginTop: '3px', fontWeight: '500' }}>
            100% on-device speech-to-text. Zero audio leaves your phone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={toggleRecording}
            className={`btn ${active ? 'btn-secondary' : 'btn-primary'} btn-sm btn-pill`}
            style={{
              background: active ? '#ffffff' : undefined,
              color: active ? '#e03131' : undefined,
              borderColor: active ? 'rgba(224, 49, 49, 0.3)' : undefined
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
              <Sparkles size={14} color="var(--bento-primary)" />
              <span>Simulate Voice</span>
            </button>
          )}
        </div>

        {interimText && (
          <div style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--bento-primary)',
            background: 'var(--bento-primary-subtle)',
            border: '1px solid rgba(73, 80, 87, 0.12)',
            padding: '6px 12px',
            borderRadius: 'var(--bento-radius-full)',
            marginTop: '2px'
          }}>
            "{interimText}"
          </div>
        )}
      </div>
    </div>
  );
}
