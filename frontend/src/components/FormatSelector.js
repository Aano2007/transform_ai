'use client';
import { CheckSquare, Square, FileText, Presentation, Linkedin, Twitter, Sliders } from 'lucide-react';

export const FORMAT_DEFINITIONS = [
  {
    id: 'executive_summary',
    label: 'Executive Summary',
    description: 'Briefing, source citations [1], and action matrix table',
    icon: FileText,
    badge: 'DOCX / MD'
  },
  {
    id: 'presentation',
    label: 'Presentation Slides',
    description: '4-6 slide 16:9 deck with speaker notes (.pptx)',
    icon: Presentation,
    badge: '16:9 PPTX'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn Post',
    description: 'High engagement format with hook, emojis & hashtags',
    icon: Linkedin,
    badge: 'SOCIAL'
  },
  {
    id: 'twitter',
    label: 'Twitter / X Thread',
    description: '3-5 numbered tweets strictly capped under 280 chars',
    icon: Twitter,
    badge: 'THREAD'
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
          fontSize: '12px',
          fontWeight: '900',
          color: 'var(--nb-black)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.5px'
        }}>
          2. Target Deliverables ({selectedFormats.length}/4)
        </label>
        <button
          type="button"
          onClick={() => onChangeFormats(FORMAT_DEFINITIONS.map(f => f.id))}
          style={{
            background: 'var(--nb-yellow-100)',
            border: '1.5px solid var(--nb-black)',
            boxShadow: '1.5px 1.5px 0px var(--nb-black)',
            color: 'var(--nb-black)',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: '800',
            padding: '3px 8px',
            borderRadius: '4px'
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
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--nb-yellow)' : '#fff',
                border: '2px solid var(--nb-black)',
                boxShadow: isSelected ? '3px 3px 0px var(--nb-black)' : '1.5px 1.5px 0px var(--nb-black)',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
                transform: isSelected ? 'translate(-1px, -1px)' : 'none'
              }}
            >
              <div style={{
                color: isSelected ? '#ffffff' : 'var(--nb-black)',
                display: 'flex',
                alignItems: 'center'
              }}>
                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>

              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: isSelected ? '#fff' : 'var(--nb-yellow-100)',
                border: '1.5px solid var(--nb-black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--nb-black)',
                flexShrink: 0
              }}>
                <Icon size={18} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: isSelected ? '#ffffff' : 'var(--nb-black)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{item.label}</span>
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    background: isSelected ? '#ffffff' : 'var(--nb-yellow)',
                    color: isSelected ? 'var(--nb-black)' : '#ffffff',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    border: '1px solid var(--nb-black)',
                    fontWeight: '800'
                  }}>
                    {item.badge}
                  </span>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: isSelected ? '#dee2e6' : 'var(--nb-text-muted)',
                  marginTop: '2px',
                  fontWeight: '600'
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
        gap: '12px',
        padding: '14px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--nb-yellow-50)',
        border: '2px solid var(--nb-black)',
        boxShadow: '2px 2px 0px var(--nb-black)'
      }}>
        <div>
          <label style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--nb-black)',
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
              background: '#fff',
              border: '2px solid var(--nb-black)',
              color: 'var(--nb-black)',
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer'
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
            color: 'var(--nb-black)',
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
              background: '#fff',
              border: '2px solid var(--nb-black)',
              color: 'var(--nb-black)',
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer'
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
