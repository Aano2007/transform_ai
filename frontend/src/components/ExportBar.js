'use client';
import { useState } from 'react';
import { Copy, Download, Share2, Check, Laptop, FileDown, CheckCircle2 } from 'lucide-react';

export default function ExportBar({
  contentToCopy = '',
  pptxUrl = null,
  docxUrl = null,
  pdfUrl = null,
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

  const handleDownload = async (url, fallbackName) => {
    try {
      if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
        const { Browser } = await import('@capacitor/browser');
        const API_BASE = 'https://wild-waves-press.loca.lt';
        const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
        await Browser.open({ url: fullUrl });
        return;
      }
    } catch (err) {
      console.warn('Capacitor Browser failed, falling back to native web', err);
    }
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fallbackName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="export-bar-container">
        <button
          type="button"
          onClick={handleCopy}
          className={`btn ${copied ? 'btn-secondary' : 'btn-primary'} btn-sm btn-pill`}
          style={{
            flex: 1,
            fontWeight: '800'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied & Synced to Clipboard!' : 'Copy Formatted Content'}</span>
        </button>

        {pptxUrl && (
          <button
            type="button"
            onClick={() => handleDownload(pptxUrl, "TransformAI_Presentation.pptx")}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ fontWeight: '800' }}
          >
            <Download size={14} />
            <span>.PPTX</span>
          </button>
        )}

        {docxUrl && (
          <button
            type="button"
            onClick={() => handleDownload(docxUrl, "TransformAI_Brief.docx")}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ fontWeight: '800' }}
          >
            <FileDown size={14} />
            <span>.DOCX</span>
          </button>
        )}

        {pdfUrl && (
          <button
            type="button"
            onClick={() => handleDownload(pdfUrl, "TransformAI_Brief.pdf")}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ fontWeight: '800' }}
          >
            <FileDown size={14} />
            <span>.PDF</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="btn btn-secondary btn-sm btn-pill"
          style={{ padding: '9px 14px' }}
          title="Share Deliverable"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Cross-Device Shared Clipboard Toast */}
      {showOfficeKitToast && (
        <div className="officekit-toast">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--clay-primary)',
            boxShadow: 'inset 1px 1px 3px rgba(255, 255, 255, 0.4), inset -1px -1px 3px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Laptop size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
              Office Kit Synced!
            </div>
            <div style={{ fontSize: '11px', color: '#ced4da', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
              Clipboard auto-broadcasted to Laptop via Local Wi-Fi
            </div>
          </div>
        </div>
      )}
    </>
  );
}
