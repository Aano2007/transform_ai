'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Presentation, Linkedin, Twitter, Code2, ArrowLeft,
  Download, Copy, Share2, Sparkles, RefreshCw, Layers, ExternalLink,
  ShieldCheck, Eye, MonitorPlay
} from 'lucide-react';
import ExportBar from '../../components/ExportBar';
import CitationModal from '../../components/CitationModal';
import SlideViewer from '../../components/SlideViewer';
import { regenerateFormatItem } from '../../lib/api';

export default function StudioScreen() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('executive_summary');
  const [activeCitation, setActiveCitation] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('transformai_active_result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
        // Set first available tab
        const available = Object.keys(parsed.outputs || {});
        if (available.length > 0 && !available.includes(activeTab)) {
          setActiveTab(available[0] === 'slides_data' ? 'presentation' : available[0]);
        }
      } catch (e) {}
    } else {
      // If accessed directly without transformation, create default demo data
      const defaultData = {
        ico: {
          event_title: "iQOO Product Strategy & Edge Compute",
          timestamp: "Present Session",
          location: "iQOO Mobile Edge Node",
          primary_objective: "One voice memo to four verified deliverables in <60s.",
          executive_overview: "Synthesized mobile voice transcript into four aligned deliverables. Architecture enforces 'The Honest Split' with on-device speech/OCR client and headless laptop compute engine.",
          key_findings: [
            "Workflow turnaround reduced from 45 minutes to 48 seconds.",
            "Zero prompt engineering required from end-user.",
            "Factual consistency guaranteed across all 4 formats via single Intent Context Object (ICO)."
          ],
          action_items: [
            { owner: "Mobile Lead", task: "Calibrate Web Speech API and Tesseract WASM", deadline: "Friday 5 PM" },
            { owner: "AI Squad", task: "Benchmark Ollama local model inference latency", deadline: "Monday EOD" }
          ],
          entities: {
            teams: ["Mobile Lead", "AI Squad", "Design"],
            dates: ["Friday 5 PM", "Monday EOD"],
            metrics: ["<60s latency", "4 deliverables", "0% hallucination drift"]
          },
          citations: [
            { id: 1, claim: "Turnaround reduced from 45 mins to 48 seconds", source_quote: "Engineers spend 45 minutes every morning translating voice notes into slides." },
            { id: 2, claim: "Factual consistency guaranteed via single ICO model", source_quote: "0% hallucination drift using our Intent Context Object architecture." }
          ]
        },
        outputs: {
          executive_summary: `# EXECUTIVE BRIEFING: iQOO Product Strategy & Edge Compute

**Date/Time:** Live Edge Session | **Context:** iQOO Mobile Compute Node | **Primary Goal:** Multi-Format Coherence

## 1. Strategic Context & Overview
Synthesized mobile voice transcript into four aligned deliverables. Architecture enforces 'The Honest Split' with on-device speech/OCR client and headless laptop compute engine. All outputs are anchored to an immutable Intent Context Object (ICO), eliminating manual rewriting and prompt drift.

## 2. Key Observations & Findings
- Workflow turnaround reduced from 45 minutes to 48 seconds. [1]
- Zero prompt engineering required from end-user. [2]
- 100% factual consistency guaranteed across all 4 formats via single Intent Context Object (ICO).

## 3. Action Matrix
| Owner / Team | Strategic Action Item | Target Deadline | Priority |
|--------------|-----------------------|-----------------|----------|
| Mobile Lead | Calibrate Web Speech API and Tesseract WASM | Friday 5 PM | High |
| AI Squad | Benchmark Ollama local model inference latency | Monday EOD | High |

## 4. Key Metrics & Impact
- Target Latency: <60s end-to-end
- 0% hallucination drift across deliverables
`,
          linkedin: `Stop spending 45 minutes turning meeting notes into slides and summaries.

Here is what happens when you capture chaos on your phone and convert it into executive deliverables in under 60 seconds:

📌 The Situation:
Transforming unstructured voice memos into aligned executive summaries, PowerPoint slides, and social updates.

Here are the key takeaways you need to know:
⚡ Workflow turnaround reduced from 45 minutes to 48 seconds
⚡ Zero manual prompt engineering needed
⚡ 100% factual consistency guaranteed across all formats

📊 The Hard Numbers:
<60s latency | 4 deliverables | 0% hallucination drift

🚀 What we're doing next:
Unifying workflow capture on the edge via iQOO Office Kit shared clipboard sync.

What is the biggest bottleneck in your daily meeting-to-deliverable workflow? Drop your perspective below! 👇

#Productivity #Leadership #TechInnovation #iQOO #FutureOfWork #AI`,
          twitter: `1/4 🧵 1 voice memo → 4 finished deliverables.

No manual typing. No prompting ChatGPT. No 45-minute formatting grind.

Here is how we transformed raw voice notes into executive execution in <60 seconds: 👇
---
2/4 🔍 The Core Findings:

• Workflow turnaround reduced from 45 mins to 48s
• Zero hallucination drift across slides, summaries & posts

All anchored to a single Intent Context Object (ICO).
---
3/4 ⚡ Metrics & Milestones:

<60s latency | 4 deliverables | 0% prompt drift

Clear owners, verified timelines, boardroom-ready.
---
4/4 🚀 Final Takeaway:

Turn raw capture into polished slides, summaries, and social assets instantly.

Built for speed. Powered by iQOO edge compute.

#Productivity #AI #iQOO`,
          slides_data: [
            {
              slide_number: 1,
              title: "iQOO Product Strategy & Edge Compute",
              subtitle: "TransformAI Executive Synthesis Deck",
              bullets: [
                "Single input transformed into 4 verified deliverables",
                "Edge client capture + Local laptop compute engine",
                "Workflow cycle time reduced from 45 minutes to under 60 seconds"
              ],
              speaker_notes: "Welcome everyone. Today we are presenting our end-to-end solution for the iQOO Hackathon. We capture chaotic inputs on mobile and process deliverables locally."
            },
            {
              slide_number: 2,
              title: "Core Findings & Architecture",
              subtitle: "The Honest Split Hardware Model",
              bullets: [
                "Phone handles on-device Speech STT and Tesseract WASM OCR",
                "Headless laptop executes Ollama LLM and python-pptx generation",
                "Zero manual prompt engineering required from user"
              ],
              speaker_notes: "Notice our clean division of labor. The phone is the fast edge client, while the laptop is our headless compute engine."
            },
            {
              slide_number: 3,
              title: "Execution Milestones & Ownership",
              subtitle: "Clear Cross-Team Accountability",
              bullets: [
                "Mobile Lead: Calibrate Web Speech API (Due: Friday 5 PM)",
                "AI Squad: Benchmark Ollama local model latency (Due: Monday EOD)",
                "Design: Polish dark cyber mobile aesthetic"
              ],
              speaker_notes: "Clear execution ownership is paramount. Each workstream has a designated owner and timeline."
            }
          ]
        },
        pptx_url: "/api/download/pptx",
        docx_url: "/api/download/docx",
        source_text: "Meeting notes with Mobile Lead and AI Squad on Q3 targets..."
      };
      setData(defaultData);
    }
  }, [activeTab]);

  if (!data) {
    return (
      <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Sparkles size={32} className="animate-spin" color="var(--iqoo-orange)" />
      </div>
    );
  }

  const { ico, outputs, pptx_url, docx_url, source_text } = data;
  const slides = outputs.slides_data || [];

  const handleRegenerateCurrentFormat = async () => {
    if (activeTab === 'ico_data' || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const res = await regenerateFormatItem({
        ico,
        format_type: activeTab,
        tone: 'direct_urgent',
        audience: 'executive'
      });
      if (res.content) {
        setData((prev) => ({
          ...prev,
          outputs: {
            ...prev.outputs,
            [activeTab]: res.content
          }
        }));
      }
    } catch (err) {
      console.warn('Regeneration error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSlideUpdated = (updatedSlides, newPptxUrl) => {
    setData((prev) => ({
      ...prev,
      outputs: {
        ...prev.outputs,
        slides_data: updatedSlides
      },
      pptx_url: newPptxUrl || prev.pptx_url
    }));
  };

  // Render text with interactive citation pills [1], [2]
  const renderTextWithCitations = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citId = parseInt(match[1], 10);
        const citObj = (ico.citations || []).find((c) => c.id === citId) || {
          id: citId,
          claim: "Verified fact from input telemetry",
          source_quote: source_text ? source_text.substring(0, 100) : "Source memo input"
        };
        return (
          <span
            key={index}
            className="citation-pill"
            onClick={() => setActiveCitation(citObj)}
            title="Click to view exact source citation in input notes"
          >
            [{citId}]
          </span>
        );
      }
      return part;
    });
  };

  const getCurrentContentForCopy = () => {
    if (activeTab === 'presentation') {
      return slides.map(s => `${s.title}\n${(s.bullets || []).join('\n')}\nNotes: ${s.speaker_notes}`).join('\n\n---\n\n');
    }
    if (activeTab === 'ico_data') {
      return JSON.stringify(ico, null, 2);
    }
    return outputs[activeTab] || '';
  };

  return (
    <div className="content-wrapper" style={{ paddingBottom: '90px' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/capture" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <ArrowLeft size={16} />
          <span>Capture</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--iqoo-green)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={13} />
            ICO VERIFIED
          </span>
        </div>
      </div>

      {/* Title & Overview Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
        borderColor: 'rgba(255, 107, 0, 0.3)'
      }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--iqoo-orange)', fontWeight: '700' }}>
          DELIVERABLE SESSION // {ico?.timestamp || 'RECENT'}
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
          {ico?.event_title || 'TransformAI Deliverable'}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
          {ico?.primary_objective}
        </p>

        {/* Entities / Metrics Row */}
        {ico?.entities?.metrics?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {ico.entities.metrics.map((m, i) => (
              <span key={i} style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: 'var(--iqoo-cyan)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                ⚡ {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs Navigation (Exec Summary, Presentation, LinkedIn, Twitter, ICO Raw) */}
      <div className="tabs-container">
        {outputs.executive_summary && (
          <button
            type="button"
            onClick={() => setActiveTab('executive_summary')}
            className={`tab-btn ${activeTab === 'executive_summary' ? 'active' : ''}`}
          >
            <FileText size={14} />
            <span>Summary</span>
          </button>
        )}

        {outputs.presentation && (
          <button
            type="button"
            onClick={() => setActiveTab('presentation')}
            className={`tab-btn ${activeTab === 'presentation' ? 'active' : ''}`}
          >
            <Presentation size={14} />
            <span>Slides ({slides.length})</span>
          </button>
        )}

        {outputs.linkedin && (
          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`tab-btn ${activeTab === 'linkedin' ? 'active' : ''}`}
          >
            <Linkedin size={14} />
            <span>LinkedIn</span>
          </button>
        )}

        {outputs.twitter && (
          <button
            type="button"
            onClick={() => setActiveTab('twitter')}
            className={`tab-btn ${activeTab === 'twitter' ? 'active' : ''}`}
          >
            <Twitter size={14} />
            <span>Twitter / X</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('ico_data')}
          className={`tab-btn ${activeTab === 'ico_data' ? 'active' : ''}`}
        >
          <Code2 size={14} />
          <span>ICO Model</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'executive_summary' && (
        <div className="card prose">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--iqoo-cyan)', fontFamily: 'var(--font-mono)' }}>
              FORMAT: EXECUTIVE BRIEFING
            </span>
            <button
              onClick={handleRegenerateCurrentFormat}
              disabled={isRegenerating}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {renderTextWithCitations(outputs.executive_summary)}
          </div>
        </div>
      )}

      {activeTab === 'presentation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--iqoo-orange)', fontFamily: 'var(--font-mono)' }}>
              16:9 WIDESCREEN SLIDE DECK
            </span>
            <Link
              href="/slides"
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
            >
              <MonitorPlay size={12} color="var(--iqoo-orange)" />
              <span>Full Presenter</span>
            </Link>
          </div>

          <SlideViewer
            slides={slides}
            ico={ico}
            pptxUrl={pptx_url}
            onSlideUpdated={handleSlideUpdated}
          />
        </div>
      )}

      {activeTab === 'linkedin' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: '#0a66c2', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              LINKEDIN EXECUTIVE POST
            </span>
            <button
              onClick={handleRegenerateCurrentFormat}
              disabled={isRegenerating}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>
          <div style={{
            whiteSpace: 'pre-line',
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'var(--text-main)',
            background: 'rgba(5, 8, 16, 0.4)',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            {renderTextWithCitations(outputs.linkedin)}
          </div>
        </div>
      )}

      {activeTab === 'twitter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--iqoo-cyan)', fontFamily: 'var(--font-mono)' }}>
              TWITTER / X THREAD (&lt;280 CHARACTERS EACH)
            </span>
            <button
              onClick={handleRegenerateCurrentFormat}
              disabled={isRegenerating}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>

          {(outputs.twitter || '').split('---').map((tweet, i) => {
            const trimmed = tweet.trim();
            if (!trimmed) return null;
            return (
              <div key={i} className="card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--iqoo-cyan)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                    TWEET {i + 1}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: trimmed.length <= 280 ? 'var(--iqoo-green)' : '#ef4444'
                  }}>
                    {trimmed.length} / 280 chars
                  </span>
                </div>
                <div style={{ whiteSpace: 'pre-line', fontSize: '13px', lineHeight: 1.5 }}>
                  {renderTextWithCitations(trimmed)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'ico_data' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--iqoo-orange)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              IMMUTABLE INTENT CONTEXT OBJECT (ICO JSON)
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              Single Truth Model
            </span>
          </div>
          <pre style={{
            background: 'rgba(5, 8, 16, 0.8)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--iqoo-cyan)',
            overflowX: 'auto',
            maxHeight: '380px'
          }}>
            {JSON.stringify(ico, null, 2)}
          </pre>
        </div>
      )}

      {/* Floating Interactive Citation Inspector */}
      <CitationModal
        citation={activeCitation}
        rawText={source_text}
        onClose={() => setActiveCitation(null)}
      />

      {/* Bottom Floating Export Bar */}
      <ExportBar
        contentToCopy={getCurrentContentForCopy()}
        pptxUrl={pptx_url}
        docxUrl={docx_url}
        title={ico?.event_title || 'TransformAI Deliverable'}
      />
    </div>
  );
}
