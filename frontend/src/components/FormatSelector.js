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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{
          fontSize: '13px',
          fontWeight: '800',
          color: 'var(--bento-primary-deep)',
          letterSpacing: '-0.2px'
        }}>
          2. Target Deliverables ({selectedFormats.length}/4)
        </label>
        <button
          type="button"
          onClick={() => onChangeFormats(FORMAT_DEFINITIONS.map(f => f.id))}
          style={{
            background: 'var(--bento-primary-subtle)',
            border: '1px solid rgba(73, 80, 87, 0.12)',
            color: 'var(--bento-primary-dark)',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: '700',
            padding: '2px 9px',
            borderRadius: 'var(--bento-radius-full)',
            transition: 'background 0.15s ease'
          }}
        >
          Select All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
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
                padding: '12px 14px',
                borderRadius: 'var(--bento-radius-sm)',
                background: isSelected ? '#ffffff' : 'var(--bento-canvas)',
                border: isSelected ? '1.5px solid var(--bento-primary)' : 'var(--bento-border)',
                boxShadow: isSelected ? 'var(--bento-shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '5px',
                background: isSelected ? 'var(--bento-primary)' : '#ffffff',
                border: isSelected ? '1.5px solid var(--bento-primary)' : '1.5px solid rgba(73, 80, 87, 0.3)',
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
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: item.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                flexShrink: 0
              }}>
                <Icon size={17} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: 'var(--bento-primary-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{item.label}</span>
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--bento-primary-subtle)',
                    color: 'var(--bento-primary-muted)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: '700'
                  }}>
                    {item.badge}
                  </span>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--bento-primary-muted)',
                  marginTop: '1px',
                  fontWeight: '500'
                }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tone & Audience Customization */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '14px',
        borderRadius: 'var(--bento-radius-sm)',
        background: 'var(--bento-primary-subtle)',
        border: 'var(--bento-border)'
      }}>
        <div>
          <label style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--bento-primary-muted)',
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
              border: 'var(--bento-border)',
              color: 'var(--bento-primary-deep)',
              padding: '8px 10px',
              borderRadius: 'var(--bento-radius-xs)',
              fontSize: '12px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--bento-shadow-xs)'
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
            fontWeight: '700',
            color: 'var(--bento-primary-muted)',
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
              border: 'var(--bento-border)',
              color: 'var(--bento-primary-deep)',
              padding: '8px 10px',
              borderRadius: 'var(--bento-radius-xs)',
              fontSize: '12px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--bento-shadow-xs)'
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
