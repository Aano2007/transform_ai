'use client';
import { useState } from 'react';
import { Copy, Download, Share2, Check, Laptop, FileDown, CheckCircle2 } from 'lucide-react';

export default function ExportBar({
  contentToCopy = '',
  pptxUrl = null,
  docxUrl = null,
  title = 'TransformAI Deliverable'
}) {
  const [copied, setCopied] = useState(false);
  const [showOfficeKitToast, setShowOfficeKitToast] = useState(false);

  const handleCopy = async () => {
    if (!contentToCopy) return;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setShowOfficeKitToast(true);

      setTimeout(() => setCopied(false), 2500);
      setTimeout(() => setShowOfficeKitToast(false), 4500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: contentToCopy.substring(0, 500)
        });
      } catch (e) {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '1000px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--bento-border)',
        borderRadius: 'var(--bento-radius-lg)',
        padding: '10px 18px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 40,
        boxShadow: 'var(--bento-shadow-lg)'
      }}>
        <button
          type="button"
          onClick={handleCopy}
          className={`btn ${copied ? 'btn-secondary' : 'btn-primary'} btn-sm btn-pill`}
          style={{
            flex: 1,
            fontWeight: '700'
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Copied & Synced to Clipboard!' : 'Copy Formatted Content'}</span>
        </button>

        {pptxUrl && (
          <a
            href={pptxUrl}
            download="TransformAI_Presentation.pptx"
            className="btn btn-secondary btn-sm btn-pill"
            style={{ textDecoration: 'none', fontWeight: '700' }}
          >
            <Download size={14} />
            <span>.PPTX</span>
          </a>
        )}

        {docxUrl && (
          <a
            href={docxUrl}
            download="TransformAI_Brief.docx"
            className="btn btn-secondary btn-sm btn-pill"
            style={{ textDecoration: 'none', fontWeight: '700' }}
          >
            <FileDown size={14} />
            <span>.DOCX</span>
          </a>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="btn btn-secondary btn-sm btn-pill"
          style={{ padding: '8px 12px' }}
          title="Share Deliverable"
        >
          <Share2 size={15} />
        </button>
      </div>

      {/* iQOO Office Kit Cross-Device Shared Clipboard Toast */}
      {showOfficeKitToast && (
        <div className="officekit-toast">
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'var(--bento-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Laptop size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#ffffff' }}>
              iQOO Office Kit Synced!
            </div>
            <div style={{ fontSize: '11px', color: '#ced4da', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>
              Clipboard auto-broadcasted to Laptop via Local Wi-Fi
            </div>
          </div>
        </div>
      )}
    </>
  );
}
