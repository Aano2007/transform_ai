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
        padding: '36px',
        textAlign: 'center',
        color: 'var(--nb-black)',
        background: 'var(--nb-yellow-50)',
        border: '2px solid var(--nb-black)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '3px 3px 0px var(--nb-black)',
        fontWeight: '700'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Slide Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--nb-yellow-50)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        border: '2px solid var(--nb-black)',
        boxShadow: '2px 2px 0px var(--nb-black)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MonitorPlay size={18} color="var(--nb-black)" />
          <span style={{
            fontSize: '13px',
            fontWeight: '900',
            fontFamily: 'var(--font-mono)',
            background: 'var(--nb-yellow)',
            border: '1.5px solid var(--nb-black)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            SLIDE {currentIdx + 1} OF {slides.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handlePrev}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
            title="Previous Slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
            title="Next Slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slide Card Preview (16:9 Aspect Ratio Canvas) */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        background: '#ffffff',
        border: '3px solid var(--nb-black)',
        boxShadow: '6px 6px 0px var(--nb-black)',
        borderRadius: 'var(--radius-md)',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        {/* Top Neobrutalist Accent Strip */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'var(--nb-yellow)',
          borderBottom: '2px solid var(--nb-black)'
        }} />

        <div style={{ marginTop: '6px' }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--nb-black)',
            fontWeight: '900',
            letterSpacing: '0.8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--nb-yellow-100)',
            border: '1.5px solid var(--nb-black)',
            padding: '2px 8px',
            borderRadius: '4px',
            marginBottom: '8px'
          }}>
            TRANSFORMAI // SLIDE {String(currentIdx + 1).padStart(2, '0')} // iQOO EDGE
          </div>
          <h3 style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: '900',
            color: 'var(--nb-black)',
            lineHeight: 1.2
          }}>
            {slide.title}
          </h3>
          {slide.subtitle && (
            <div style={{
              fontSize: '13px',
              color: 'var(--nb-black)',
              marginTop: '4px',
              fontWeight: '700',
              opacity: 0.8
            }}>
              {slide.subtitle}
            </div>
          )}
        </div>

        {/* Bullets */}
        <div style={{
          flex: 1,
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflowY: 'auto'
        }}>
          {(slide.bullets || []).map((b, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--nb-black)',
              lineHeight: 1.4
            }}>
              <span style={{
                background: 'var(--nb-yellow)',
                border: '1.5px solid var(--nb-black)',
                color: 'var(--nb-black)',
                fontWeight: '900',
                width: '18px',
                height: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '3px',
                fontSize: '10px',
                flexShrink: 0,
                marginTop: '1px'
              }}>
                ▸
              </span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Slide Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '2px solid var(--nb-black)',
          paddingTop: '8px',
          marginTop: '8px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--nb-text-muted)', fontWeight: '700' }}>
            Factual Grounding • Single ICO Model
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--nb-black)',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            background: 'var(--nb-yellow)',
            border: '1px solid var(--nb-black)',
            padding: '1px 6px',
            borderRadius: '3px'
          }}>
            16:9 Widescreen (.PPTX)
          </span>
        </div>
      </div>

      {/* Slide Actions Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleRegenerateCurrentSlide}
          disabled={isRegenerating}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
        >
          <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
          <span>{isRegenerating ? 'Refining...' : 'Refine Slide Content'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="btn btn-secondary btn-sm"
        >
          <MessageSquare size={14} />
          <span>{showNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
        </button>

        {pptxUrl && (
          <a
            href={pptxUrl}
            download="TransformAI_Presentation.pptx"
            className="btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            <Download size={14} />
            <span>Download Deck (.pptx)</span>
          </a>
        )}
      </div>

      {/* Speaker Notes Box */}
      {showNotes && (
        <div style={{
          background: 'var(--nb-yellow-50)',
          border: '2px solid var(--nb-black)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          borderLeft: '6px solid var(--nb-yellow)',
          boxShadow: '2px 2px 0px var(--nb-black)'
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '900',
            color: 'var(--nb-black)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <MessageSquare size={13} />
            <span>SPEAKER SCRIPT / PRESENTER NOTES:</span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--nb-black)', fontStyle: 'italic', lineHeight: 1.6, fontWeight: '600' }}>
            "{slide.speaker_notes || 'Deliver the core slide takeaways with confidence and conviction.'}"
          </p>
        </div>
      )}
    </div>
  );
}
