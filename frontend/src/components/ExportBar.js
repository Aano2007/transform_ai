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
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '2.5px solid var(--nb-black)',
        padding: '12px 20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <button
            type="button"
            onClick={handleCopy}
            className={`btn ${copied ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{
              flex: 1,
              background: copied ? 'var(--nb-yellow-100)' : undefined,
              borderColor: 'var(--nb-black)',
              fontWeight: '800'
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied & Synced to Clipboard!' : 'Copy Formatted Text'}</span>
          </button>

          {pptxUrl && (
            <a
              href={pptxUrl}
              download="TransformAI_Presentation.pptx"
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: 'none', fontWeight: '800' }}
            >
              <Download size={15} />
              <span>.PPTX Deck</span>
            </a>
          )}

          {docxUrl && (
            <a
              href={docxUrl}
              download="TransformAI_Brief.docx"
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: 'none', fontWeight: '800' }}
            >
              <FileDown size={15} />
              <span>.DOCX Brief</span>
            </a>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px 14px' }}
            title="Share Deliverable"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* iQOO Office Kit Cross-Device Shared Clipboard Toast */}
      {showOfficeKitToast && (
        <div className="officekit-toast">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: 'var(--nb-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--nb-yellow)'
          }}>
            <Laptop size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--nb-black)' }}>
              iQOO Office Kit Synced!
            </div>
            <div style={{ fontSize: '11px', color: 'var(--nb-black)', opacity: 0.85, fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
              Clipboard auto-broadcasted to Laptop via Local Wi-Fi
            </div>
          </div>
        </div>
      )}
    </>
  );
}
