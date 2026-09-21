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
        color: 'var(--bento-primary-muted)',
        background: '#ffffff',
        border: 'var(--bento-border)',
        borderRadius: 'var(--bento-radius-lg)',
        boxShadow: 'var(--bento-shadow)',
        fontWeight: '600'
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
        background: '#ffffff',
        padding: '10px 16px',
        borderRadius: 'var(--bento-radius-md)',
        border: 'var(--bento-border)',
        boxShadow: 'var(--bento-shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MonitorPlay size={17} color="var(--bento-primary)" />
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)',
            background: 'var(--bento-primary-subtle)',
            color: 'var(--bento-primary-deep)',
            padding: '2px 9px',
            borderRadius: 'var(--bento-radius-full)'
          }}>
            SLIDE {currentIdx + 1} OF {slides.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={handlePrev}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ padding: '6px 10px' }}
            title="Previous Slide"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ padding: '6px 10px' }}
            title="Next Slide"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Slide Card Preview (16:9 Aspect Ratio Canvas) */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        background: 'linear-gradient(135deg, #ffffff 0%, #fbfcfd 100%)',
        border: 'var(--bento-border)',
        boxShadow: 'var(--bento-shadow-lg)',
        borderRadius: 'var(--bento-radius-lg)',
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        {/* Top Accent Gradient Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--bento-primary), var(--bento-primary-light))'
        }} />

        <div>
          <div style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--bento-primary)',
            fontWeight: '800',
            letterSpacing: '0.8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bento-primary-subtle)',
            padding: '2px 8px',
            borderRadius: 'var(--bento-radius-full)',
            marginBottom: '8px'
          }}>
            TRANSFORMAI // SLIDE {String(currentIdx + 1).padStart(2, '0')} // iQOO EDGE
          </div>
          <h3 style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: '900',
            color: 'var(--bento-primary-deep)',
            lineHeight: 1.25,
            letterSpacing: '-0.5px'
          }}>
            {slide.title}
          </h3>
          {slide.subtitle && (
            <div style={{
              fontSize: '13px',
              color: 'var(--bento-primary-muted)',
              marginTop: '3px',
              fontWeight: '600'
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
          gap: '8px',
          overflowY: 'auto'
        }}>
          {(slide.bullets || []).map((b, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: '600',
              color: 'var(--bento-primary-dark)',
              lineHeight: 1.4
            }}>
              <span style={{
                color: 'var(--bento-primary)',
                fontWeight: '900',
                fontSize: '14px',
                lineHeight: 1
              }}>
                •
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
          borderTop: '1px solid rgba(73, 80, 87, 0.08)',
          paddingTop: '8px',
          marginTop: '8px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--bento-primary-muted)', fontWeight: '500' }}>
            Factual Grounding • Single ICO Model
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--bento-primary-muted)',
            fontFamily: 'var(--font-mono)',
            fontWeight: '600'
          }}>
            16:9 Widescreen (.PPTX)
          </span>
        </div>
      </div>

      {/* Slide Actions Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleRegenerateCurrentSlide}
          disabled={isRegenerating}
          className="btn btn-secondary btn-sm btn-pill"
          style={{ flex: 1 }}
        >
          <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
          <span>{isRegenerating ? 'Refining...' : 'Refine Slide'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="btn btn-secondary btn-sm btn-pill"
        >
          <MessageSquare size={13} />
          <span>{showNotes ? 'Hide Notes' : 'Speaker Notes'}</span>
        </button>

        {pptxUrl && (
          <a
            href={pptxUrl}
            download="TransformAI_Presentation.pptx"
            className="btn btn-primary btn-sm btn-pill"
            style={{ textDecoration: 'none' }}
          >
            <Download size={13} />
            <span>Deck (.pptx)</span>
          </a>
        )}
      </div>

      {/* Speaker Notes Box */}
      {showNotes && (
        <div style={{
          background: '#ffffff',
          border: 'var(--bento-border)',
          borderRadius: 'var(--bento-radius-md)',
          padding: '16px',
          borderLeft: '4px solid var(--bento-primary)',
          boxShadow: 'var(--bento-shadow-xs)'
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            color: 'var(--bento-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <MessageSquare size={12} />
            <span>SPEAKER SCRIPT / SCRIPT NOTES:</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--bento-primary-deep)', fontStyle: 'italic', lineHeight: 1.6, fontWeight: '500' }}>
            "{slide.speaker_notes || 'Deliver the core slide takeaways with confidence and conviction.'}"
          </p>
        </div>
      )}
    </div>
  );
}
