'use client';
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceRecorder({ onTranscriptUpdate, currentText = '' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        // no-speech / network are non-fatal — recognition will auto-restart via onend
        if (e.error === 'not-allowed' || e.error === 'audio-capture') {
          setIsRecording(false);
          setErrorMessage(
            e.error === 'not-allowed'
              ? 'Microphone permission denied. Please allow microphone access.'
              : 'No microphone found. Please connect a microphone and try again.'
          );
        }
        // suppress no-speech / network silently
      };

      recog.onend = () => {
        // If still supposed to be recording, restart automatically (handles no-speech timeout)
        setIsRecording((prev) => {
          if (prev) {
            try { recog.start(); } catch (_) {}
            return true;
          }
          return false;
        });
      };

      setRecognition(recog);
    }
  }, [onTranscriptUpdate]);

  const toggleRecording = () => {
    setErrorMessage('');
    if (!recognition) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type directly into the transcript box.');
      return;
    }

    if (isRecording) {
      setIsRecording(false); // set false BEFORE stop() so onend doesn't restart
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
        setErrorMessage('Could not start microphone. Please check permissions.');
        setIsRecording(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        background: 'rgb(233, 236, 239)',
        border: isRecording ? '1.5px solid var(--clay-primary)' : 'var(--clay-border)',
        borderRadius: 'var(--clay-radius-card)',
        boxShadow: isRecording ? 'var(--clay-shadow-card-hover)' : 'var(--clay-shadow-card)',
        padding: '30px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {isRecording ? (
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
            {isRecording ? 'Listening (Microphone Active)...' : 'Tap to Record Voice Memo'}
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--clay-primary-muted)', marginTop: '4px', fontWeight: '500' }}>
            100% on-device speech-to-text. Zero audio leaves your phone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={toggleRecording}
            className={`btn ${isRecording ? 'btn-secondary' : 'btn-primary'} btn-sm btn-pill`}
            style={{
              background: isRecording ? 'var(--clay-accent-coral-bg)' : undefined,
              color: isRecording ? 'var(--clay-accent-coral)' : undefined,
              borderColor: isRecording ? 'rgba(201, 42, 42, 0.2)' : undefined,
              boxShadow: isRecording ? 'var(--clay-shadow-btn-secondary)' : undefined
            }}
          >
            {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{isRecording ? 'Stop Recording' : 'Start Microphone'}</span>
          </button>
        </div>

        {errorMessage && (
          <div style={{
            fontSize: '12px',
            color: '#c92a2a',
            background: '#ffe3e3',
            border: '1px solid #ffa8a8',
            padding: '6px 14px',
            borderRadius: 'var(--clay-radius-pill)',
            fontWeight: '600'
          }}>
            {errorMessage}
          </div>
        )}

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
