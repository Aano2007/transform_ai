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
    <div className="content-wrapper" style={{ paddingBottom: '90px' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/studio" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <ArrowLeft size={16} />
          <span>Studio</span>
        </Link>

        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--iqoo-orange)' }}>
          SCREEN 4 // SLIDE PRESENTER
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
            Executive Slide Deck
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            16:9 Presentation Decks with Speaker Notes
          </p>
        </div>

        <span style={{
          padding: '4px 8px',
          background: 'rgba(255, 107, 0, 0.12)',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          borderRadius: '4px',
          fontSize: '11px',
          color: 'var(--iqoo-orange)',
          fontWeight: '700',
          fontFamily: 'var(--font-mono)'
        }}>
          {slides.length} SLIDES
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
      <div className="card" style={{
        background: 'rgba(0, 240, 255, 0.04)',
        borderColor: 'rgba(0, 240, 255, 0.2)',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ color: 'var(--iqoo-cyan)', fontWeight: '800', fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Laptop size={14} />
          iQOO OFFICE KIT STRATEGY NOTE:
        </div>
        <div>
          During the hackathon pitch, tap <strong>"Deck (.pptx)"</strong> to download on phone, then drag directly to your laptop display via iQOO Office Kit multi-screen collaboration.
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
