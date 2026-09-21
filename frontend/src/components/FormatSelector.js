'use client';
import { CheckSquare, Square, FileText, Presentation, Linkedin, Twitter, Sliders, Check } from 'lucide-react';

export const FORMAT_DEFINITIONS = [
  {
    id: 'executive_summary',
    label: 'Executive Summary',
    description: 'Briefing, source citations [1], and action matrix table',
    icon: FileText,
    badge: 'DOCX / MD',
    color: '#1971c2',
    bg: '#e7f5ff'
  },
  {
    id: 'presentation',
    label: 'Presentation Slides',
    description: '4-6 slide 16:9 deck with speaker notes (.pptx)',
    icon: Presentation,
    badge: '16:9 PPTX',
    color: '#495057',
    bg: '#e9ecef'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn Post',
    description: 'High engagement format with hook, emojis & hashtags',
    icon: Linkedin,
    badge: 'SOCIAL',
    color: '#0a66c2',
    bg: '#e8f4fd'
  },
  {
    id: 'twitter',
    label: 'Twitter / X Thread',
    description: '3-5 numbered tweets strictly capped under 280 chars',
    icon: Twitter,
    badge: 'THREAD',
    color: '#1d9bf0',
    bg: '#e8f7fe'
  }
];

export default function FormatSelector({
  selectedFormats,
  onChangeFormats,
  tone,
  onChangeTone,
  audience,
  onChangeAudience
}) {
  const toggleFormat = (id) => {
    if (selectedFormats.includes(id)) {
      if (selectedFormats.length === 1) return; // Keep at least one selected
      onChangeFormats(selectedFormats.filter((f) => f !== id));
    } else {
      onChangeFormats([...selectedFormats, id]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{
          fontSize: '13px',
          fontWeight: '800',
          color: 'var(--clay-primary-deep)',
          letterSpacing: '-0.2px'
        }}>
          2. Target Deliverables ({selectedFormats.length}/4)
        </label>
        <button
          type="button"
          onClick={() => onChangeFormats(FORMAT_DEFINITIONS.map(f => f.id))}
          style={{
            background: 'var(--clay-card-inset)',
            boxShadow: 'var(--clay-shadow-inset)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            color: 'var(--clay-primary-dark)',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: '800',
            padding: '3px 10px',
            borderRadius: 'var(--clay-radius-pill)',
            transition: 'all 0.15s ease'
          }}
        >
          Select All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
        {FORMAT_DEFINITIONS.map((item) => {
          const isSelected = selectedFormats.includes(item.id);
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => toggleFormat(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--clay-radius-inner)',
                background: isSelected ? '#ffffff' : 'var(--clay-card-inset)',
                border: isSelected ? '1.5px solid rgba(73, 80, 87, 0.18)' : '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: isSelected 
                  ? '6px 10px 22px rgba(73, 80, 87, 0.09), inset 2px 2px 4px rgba(255, 255, 255, 0.95), inset -2px -2px 4px rgba(73, 80, 87, 0.04)' 
                  : 'var(--clay-shadow-inset)',
                cursor: 'pointer',
                transform: isSelected ? 'translateY(-1px)' : 'none',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '7px',
                background: isSelected ? 'var(--clay-primary)' : '#ffffff',
                border: isSelected ? 'none' : '1.5px solid rgba(73, 80, 87, 0.25)',
                boxShadow: isSelected 
                  ? 'inset 1px 1px 2px rgba(255, 255, 255, 0.4), inset -1px -1px 2px rgba(0, 0, 0, 0.3)'
                  : 'inset 1px 1px 3px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}>
                {isSelected && <Check size={14} strokeWidth={3} />}
              </div>

              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: item.bg,
                boxShadow: 'inset 1px 1px 3px rgba(255, 255, 255, 0.8), inset -1px -1px 3px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                flexShrink: 0
              }}>
                <Icon size={18} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13.5px',
                  fontWeight: '800',
                  color: 'var(--clay-primary-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{item.label}</span>
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--clay-card-inset)',
                    boxShadow: 'var(--clay-shadow-inset)',
                    color: 'var(--clay-primary-muted)',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: '800'
                  }}>
                    {item.badge}
                  </span>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--clay-primary-muted)',
                  marginTop: '2px',
                  fontWeight: '500'
                }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tone & Audience Clay Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '16px',
        borderRadius: 'var(--clay-radius-inner)',
        background: 'var(--clay-card-inset)',
        boxShadow: 'var(--clay-shadow-inset)',
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}>
        <div>
          <label style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--clay-primary-muted)',
            display: 'block',
            marginBottom: '6px',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)'
          }}>
            Tone Profile
          </label>
          <select
            value={tone}
            onChange={(e) => onChangeTone(e.target.value)}
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              color: 'var(--clay-primary-deep)',
              padding: '10px 12px',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--clay-shadow-btn-secondary)'
            }}
          >
            <option value="professional">Professional</option>
            <option value="direct_urgent">Direct & Urgent</option>
            <option value="visionary">Visionary & Inspiring</option>
            <option value="technical">Deep Technical</option>
          </select>
        </div>

        <div>
          <label style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--clay-primary-muted)',
            display: 'block',
            marginBottom: '6px',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)'
          }}>
            Target Audience
          </label>
          <select
            value={audience}
            onChange={(e) => onChangeAudience(e.target.value)}
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              color: 'var(--clay-primary-deep)',
              padding: '10px 12px',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--clay-shadow-btn-secondary)'
            }}
          >
            <option value="executive">C-Suite / Leadership</option>
            <option value="engineering">Engineering Team</option>
            <option value="investors">Investors & Board</option>
            <option value="public">General Public</option>
          </select>
        </div>
      </div>
    </div>
  );
}
