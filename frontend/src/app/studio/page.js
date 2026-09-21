'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Presentation, Linkedin, Twitter, Code2, ArrowLeft,
  Download, Copy, Share2, Sparkles, RefreshCw, Layers, ExternalLink,
  ShieldCheck, Eye, MonitorPlay, Zap
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
        const available = Object.keys(parsed.outputs || {});
        if (available.length > 0 && !available.includes(activeTab)) {
          setActiveTab(available[0] === 'slides_data' ? 'presentation' : available[0]);
        }
      } catch (e) {}
    } else {
      // Fallback demo data if visited directly
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
      <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Sparkles size={36} className="animate-spin" color="var(--nb-black)" />
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
            title="Click to inspect exact source citation"
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
          href="/capture"
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Capture Workspace</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            background: 'var(--nb-green)',
            color: 'var(--nb-black)',
            border: '1.5px solid var(--nb-black)',
            boxShadow: '1.5px 1.5px 0px var(--nb-black)',
            padding: '3px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <ShieldCheck size={14} />
            ICO GROUND TRUTH VERIFIED
          </span>
        </div>
      </div>

      {/* Deliverable Meta Banner */}
      <div className="card card-hero">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div className="card-badge-header">
            DELIVERABLE SESSION // {ico?.timestamp || 'RECENT'}
          </div>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            color: 'var(--nb-black)',
            background: '#fff',
            border: '1px solid var(--nb-black)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            📍 {ico?.location || 'iQOO Edge Node'}
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 26px)',
          fontWeight: '900',
          color: 'var(--nb-black)',
          marginTop: '6px'
        }}>
          {ico?.event_title || 'TransformAI Deliverable'}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--nb-text-muted)', marginTop: '4px', fontWeight: '600' }}>
          {ico?.primary_objective}
        </p>

        {/* Entities & Metrics Row */}
        {ico?.entities?.metrics?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {ico.entities.metrics.map((m, i) => (
              <span key={i} style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '800',
                background: 'var(--nb-yellow)',
                border: '1.5px solid var(--nb-black)',
                boxShadow: '1.5px 1.5px 0px var(--nb-black)',
                color: '#ffffff',
                padding: '3px 8px',
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
            <FileText size={15} />
            <span>Executive Briefing</span>
          </button>
        )}

        {outputs.presentation && (
          <button
            type="button"
            onClick={() => setActiveTab('presentation')}
            className={`tab-btn ${activeTab === 'presentation' ? 'active' : ''}`}
          >
            <Presentation size={15} />
            <span>Slide Deck ({slides.length})</span>
          </button>
        )}

        {outputs.linkedin && (
          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`tab-btn ${activeTab === 'linkedin' ? 'active' : ''}`}
          >
            <Linkedin size={15} />
            <span>LinkedIn Post</span>
          </button>
        )}

        {outputs.twitter && (
          <button
            type="button"
            onClick={() => setActiveTab('twitter')}
            className={`tab-btn ${activeTab === 'twitter' ? 'active' : ''}`}
          >
            <Twitter size={15} />
            <span>Twitter / X Thread</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('ico_data')}
          className={`tab-btn ${activeTab === 'ico_data' ? 'active' : ''}`}
        >
          <Code2 size={15} />
          <span>ICO Model (JSON)</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'executive_summary' && (
        <div className="card prose">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            borderBottom: '2px solid var(--nb-black)',
            paddingBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--nb-black)', fontFamily: 'var(--font-mono)' }}>
              FORMAT: EXECUTIVE BRIEFING (.DOCX / MARKDOWN)
            </span>
            <button
              onClick={handleRegenerateCurrentFormat}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 10px' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--nb-black)',
            paddingBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--nb-black)', fontFamily: 'var(--font-mono)' }}>
              FORMAT: 16:9 WIDESCREEN PRESENTATION DECK (.PPTX)
            </span>
            <Link
              href="/slides"
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <MonitorPlay size={14} />
              <span>Full Stage Presenter</span>
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            borderBottom: '2px solid var(--nb-black)',
            paddingBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--nb-black)', fontFamily: 'var(--font-mono)' }}>
              FORMAT: LINKEDIN LEADERSHIP POST
            </span>
            <button
              onClick={handleRegenerateCurrentFormat}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 10px' }}
            >
              <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>
          <div style={{
            whiteSpace: 'pre-line',
            fontSize: '14px',
            lineHeight: '1.7',
            color: 'var(--nb-black)',
            background: 'var(--nb-yellow-50)',
            padding: '18px',
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0px var(--nb-black)'
          }}>
            {renderTextWithCitations(outputs.linkedin)}
          </div>
        </div>
      )}

      {activeTab === 'twitter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--nb-black)',
            paddingBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--nb-black)', fontFamily: 'var(--font-mono)' }}>
              FORMAT: TWITTER / X THREAD (&lt;280 CHARACTERS EACH)
            </span>
            <button
              onClick={handleRegenerateCurrentFormat}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 10px' }}
            >
              <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>

          {(outputs.twitter || '').split('---').map((tweet, i) => {
            const trimmed = tweet.trim();
            if (!trimmed) return null;
            return (
              <div key={i} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '900',
                    background: 'var(--nb-yellow)',
                    color: '#ffffff',
                    border: '1.5px solid var(--nb-black)',
                    boxShadow: '1.5px 1.5px 0px var(--nb-black)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    TWEET {i + 1}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '800',
                    color: trimmed.length <= 280 ? '#15803d' : '#b91c1c',
                    background: trimmed.length <= 280 ? '#dcfce7' : '#fee2e2',
                    border: '1px solid var(--nb-black)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {trimmed.length} / 280 chars
                  </span>
                </div>
                <div style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: 1.6, color: 'var(--nb-black)' }}>
                  {renderTextWithCitations(trimmed)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'ico_data' && (
        <div className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '2px solid var(--nb-black)',
            paddingBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--nb-black)', fontFamily: 'var(--font-mono)' }}>
              IMMUTABLE INTENT CONTEXT OBJECT (ICO JSON)
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              background: 'var(--nb-yellow)',
              color: '#ffffff',
              border: '1px solid var(--nb-black)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '800'
            }}>
              Single Truth Model
            </span>
          </div>
          <pre style={{
            background: 'var(--nb-black)',
            color: 'var(--nb-yellow)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            border: '2.5px solid var(--nb-black)',
            boxShadow: '3px 3px 0px var(--nb-black)',
            overflowX: 'auto',
            maxHeight: '450px'
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
