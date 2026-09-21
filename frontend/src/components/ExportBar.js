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
        position: 'sticky',
        bottom: 0,
        background: 'rgba(10, 15, 29, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '12px 16px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        zIndex: 40
      }}>
        <button
          type="button"
          onClick={handleCopy}
          className={`btn ${copied ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          style={{
            flex: 1,
            background: copied ? 'rgba(16, 185, 129, 0.2)' : undefined,
            borderColor: copied ? 'var(--iqoo-green)' : undefined,
            color: copied ? 'var(--iqoo-green)' : undefined
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied & Synced' : 'Copy'}</span>
        </button>

        {pptxUrl && (
          <a
            href={pptxUrl}
            download="TransformAI_Presentation.pptx"
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: 'var(--iqoo-orange)',
              color: 'var(--iqoo-orange)',
              textDecoration: 'none'
            }}
          >
            <Download size={15} />
            <span>.PPTX</span>
          </a>
        )}

        {docxUrl && (
          <a
            href={docxUrl}
            download="TransformAI_Brief.docx"
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: 'var(--iqoo-cyan)',
              color: 'var(--iqoo-cyan)',
              textDecoration: 'none'
            }}
          >
            <FileDown size={15} />
            <span>.DOCX</span>
          </a>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px 12px' }}
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* iQOO Office Kit Cross-Device Shared Clipboard Toast */}
      {showOfficeKitToast && (
        <div className="officekit-toast">
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(0, 240, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--iqoo-cyan)'
          }}>
            <Laptop size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>
              iQOO Office Kit Synced!
            </div>
            <div style={{ fontSize: '11px', color: 'var(--iqoo-cyan)', fontFamily: 'var(--font-mono)' }}>
              Clipboard auto-synced to Laptop via Local Wi-Fi
            </div>
          </div>
        </div>
      )}
    </>
  );
}
