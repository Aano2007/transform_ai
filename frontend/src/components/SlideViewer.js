'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, RefreshCw, MessageSquare, MonitorPlay, Sparkles } from 'lucide-react';
import { regenerateSlideItem } from '../lib/api';

export default function SlideViewer({ slides = [], ico = null, pptxUrl = null, onSlideUpdated }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  if (!slides || slides.length === 0) {
    return (
      <div style={{
        padding: '30px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-md)'
      }}>
        No slide data available.
      </div>
    );
  }

  const slide = slides[currentIdx] || slides[0];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleRegenerateCurrentSlide = async () => {
    if (!ico || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const res = await regenerateSlideItem({
        ico,
        slide_number: currentIdx + 1,
        instructions: 'Elevate strategic impact, clarify bullet takeaways'
      });
      if (onSlideUpdated && res.all_slides) {
        onSlideUpdated(res.all_slides, res.pptx_url);
      }
    } catch (err) {
      console.warn('Slide regeneration error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Slide Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MonitorPlay size={16} color="var(--iqoo-orange)" />
          <span style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
            SLIDE {currentIdx + 1} OF {slides.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={handlePrev}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              borderRadius: '6px',
              padding: '6px 8px',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              borderRadius: '6px',
              padding: '6px 8px',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slide Card Preview (16:9 Aspect Ratio) */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        background: 'radial-gradient(circle at 10% 10%, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(255, 107, 0, 0.4)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 107, 0, 0.1)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        {/* Top Accent Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--iqoo-orange), var(--iqoo-cyan))'
        }} />

        <div>
          <div style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--iqoo-cyan)',
            fontWeight: '700',
            letterSpacing: '0.8px',
            marginBottom: '4px'
          }}>
            TRANSFORMAI // SLIDE {String(currentIdx + 1).padStart(2, '0')} // iQOO EDGE
          </div>
          <h3 style={{
            fontSize: '17px',
            fontWeight: '800',
            color: '#fff',
            lineHeight: 1.2
          }}>
            {slide.title}
          </h3>
          {slide.subtitle && (
            <div style={{ fontSize: '11px', color: 'var(--iqoo-orange)', marginTop: '2px', fontWeight: '600' }}>
              {slide.subtitle}
            </div>
          )}
        </div>

        {/* Bullets */}
        <div style={{
          flex: 1,
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          overflowY: 'auto'
        }}>
          {(slide.bullets || []).map((b, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '8px',
              fontSize: '11px',
              color: 'var(--text-main)',
              lineHeight: 1.3
            }}>
              <span style={{ color: 'var(--iqoo-orange)', fontWeight: 'bold' }}>▸</span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Slide Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '6px',
          marginTop: '6px'
        }}>
          <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
            Factual Grounding • Single ICO Model
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            16:9 Widescreen (.PPTX)
          </span>
        </div>
      </div>

      {/* Slide Actions Bar */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={handleRegenerateCurrentSlide}
          disabled={isRegenerating}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
        >
          <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
          <span>{isRegenerating ? 'Refining...' : 'Refine Slide'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="btn btn-secondary btn-sm"
        >
          <MessageSquare size={14} color="var(--iqoo-cyan)" />
          <span>{showNotes ? 'Hide Notes' : 'Speaker Notes'}</span>
        </button>

        {pptxUrl && (
          <a
            href={pptxUrl}
            download="TransformAI_Presentation.pptx"
            className="btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            <Download size={14} />
            <span>Deck (.pptx)</span>
          </a>
        )}
      </div>

      {/* Speaker Notes Box */}
      {showNotes && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          borderLeft: '3px solid var(--iqoo-cyan)'
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            color: 'var(--iqoo-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <MessageSquare size={12} />
            SPEAKER SCRIPT / SCRIPT NOTES:
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{slide.speaker_notes || 'Deliver the core slide takeaways with conviction.'}"
          </p>
        </div>
      )}
    </div>
  );
}
