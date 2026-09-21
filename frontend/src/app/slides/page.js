'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MonitorPlay, Download, Share2, Sparkles, Laptop } from 'lucide-react';
import SlideViewer from '../../components/SlideViewer';
import ExportBar from '../../components/ExportBar';

export default function SlideDetailScreen() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('transformai_active_result');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const handleSlideUpdated = (updatedSlides, newPptxUrl) => {
    setData((prev) => {
      const updated = {
        ...prev,
        outputs: {
          ...prev.outputs,
          slides_data: updatedSlides
        },
        pptx_url: newPptxUrl || prev.pptx_url
      };
      sessionStorage.setItem('transformai_active_result', JSON.stringify(updated));
      return updated;
    });
  };

  const slides = data?.outputs?.slides_data || [
    {
      slide_number: 1,
      title: "TransformAI Executive Deck",
      subtitle: "iQOO Hackathon Productivity Track",
      bullets: [
        "1 Voice Memo → 4 Polished Deliverables",
        "Edge capture on iQOO + Local compute engine",
        "Under 60 seconds end-to-end turnaround"
      ],
      speaker_notes: "Welcome to TransformAI. We demonstrate how to eliminate 45 minutes of manual summarization every day."
    },
    {
      slide_number: 2,
      title: "The Honest Split Architecture",
      subtitle: "Edge & Headless Separation",
      bullets: [
        "Web Speech API: 100% on-device STT",
        "Tesseract.js WASM: On-device whiteboard OCR",
        "FastAPI + Ollama: Headless laptop inference over Wi-Fi"
      ],
      speaker_notes: "By processing speech and camera inputs on the phone, we eliminate audio upload latencies and protect user privacy."
    },
    {
      slide_number: 3,
      title: "Output Formats & Consistency",
      subtitle: "Zero Hallucination Drift",
      bullets: [
        "Executive Summary with bracketed citations",
        "16:9 Widescreen PPTX with speaker scripts",
        "Platform-optimized LinkedIn & Twitter threads"
      ],
      speaker_notes: "Every output is derived from the single Intent Context Object, guaranteeing factual coherence across formats."
    }
  ];

  return (
    <div className="content-wrapper" style={{ paddingBottom: '100px' }}>
      {/* Top Bar Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid var(--nb-black)',
        paddingBottom: '12px'
      }}>
        <Link
          href="/studio"
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Deliverables</span>
        </Link>

        <span style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          fontWeight: '900',
          background: 'var(--nb-yellow)',
          color: '#ffffff',
          border: '1.5px solid var(--nb-black)',
          boxShadow: '1.5px 1.5px 0px var(--nb-black)',
          padding: '3px 10px',
          borderRadius: '4px'
        }}>
          SCREEN 4 // SLIDE PRESENTER STAGE
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '6px 0'
      }}>
        <div>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: '900', color: 'var(--nb-black)' }}>
            Executive Presentation Deck
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--nb-text-muted)', fontWeight: '600' }}>
            16:9 Widescreen Presentation Canvas with Speaker Teleprompter
          </p>
        </div>

        <span style={{
          padding: '4px 10px',
          background: 'var(--nb-yellow)',
          border: '2px solid var(--nb-black)',
          boxShadow: '2px 2px 0px var(--nb-black)',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#ffffff',
          fontWeight: '900',
          fontFamily: 'var(--font-mono)'
        }}>
          {slides.length} SLIDES LOADED
        </span>
      </div>

      {/* Slide Carousel Viewer */}
      <SlideViewer
        slides={slides}
        ico={data?.ico}
        pptxUrl={data?.pptx_url || '/api/download/pptx'}
        onSlideUpdated={handleSlideUpdated}
      />

      {/* Office Kit Pitch Pro-Tip Box */}
      <div className="card card-yellow">
        <div style={{
          color: 'var(--nb-black)',
          fontWeight: '900',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Laptop size={16} />
          <span>iQOO OFFICE KIT STRATEGY NOTE:</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--nb-black)', fontWeight: '600', lineHeight: 1.5 }}>
          During your presentation, download the <strong>.PPTX</strong> deck and drag it across devices in seconds using iQOO Office Kit multi-screen collaboration.
        </div>
      </div>

      {/* Bottom Export Bar */}
      <ExportBar
        contentToCopy={slides.map(s => `${s.title}\n${(s.bullets || []).join('\n')}\nNotes: ${s.speaker_notes}`).join('\n\n---\n\n')}
        pptxUrl={data?.pptx_url || '/api/download/pptx'}
        docxUrl={data?.docx_url || '/api/download/docx'}
        title="TransformAI Slides"
      />
    </div>
  );
}
