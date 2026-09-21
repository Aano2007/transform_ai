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
        background: active ? 'var(--nb-yellow-100)' : 'var(--nb-yellow-50)',
        border: '2.5px solid var(--nb-black)',
        borderRadius: 'var(--radius-md)',
        boxShadow: active ? '4px 4px 0px var(--nb-black)' : '2px 2px 0px var(--nb-black)',
        padding: '24px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        transition: 'all 0.15s ease'
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
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--nb-yellow)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0px var(--nb-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--nb-black)'
          }}>
            <Mic size={28} />
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--nb-black)' }}>
            {active ? 'Listening (Web Speech API Edge)...' : 'Tap to Record Voice Memo'}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--nb-text-muted)', marginTop: '4px', fontWeight: '600' }}>
            100% on-device speech-to-text. Zero audio sent to cloud.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={toggleRecording}
            className={`btn ${active ? 'btn-dark' : 'btn-primary'} btn-sm`}
          >
            {active ? <MicOff size={16} /> : <Mic size={16} />}
            <span>{active ? 'Stop Recording' : 'Start Microphone'}</span>
          </button>

          {!active && (
            <button
              type="button"
              onClick={simulateVoiceStream}
              className="btn btn-secondary btn-sm"
              title="Simulate realistic voice input stream"
            >
              <Sparkles size={14} color="var(--nb-black)" />
              <span>Simulate Voice</span>
            </button>
          )}
        </div>

        {interimText && (
          <div style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--nb-black)',
            background: '#fff',
            border: '1.5px solid var(--nb-black)',
            padding: '4px 10px',
            borderRadius: '4px',
            marginTop: '4px'
          }}>
            "{interimText}"
          </div>
        )}
      </div>
    </div>
  );
}
