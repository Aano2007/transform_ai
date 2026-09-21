'use client';
import { CheckSquare, Square, FileText, Presentation, Linkedin, Twitter, Sliders } from 'lucide-react';

export const FORMAT_DEFINITIONS = [
  {
    id: 'executive_summary',
    label: 'Executive Summary',
    description: 'Briefing, source citations [1], and action matrix table',
    icon: FileText,
    color: '#00f0ff'
  },
  {
    id: 'presentation',
    label: 'Presentation Slides',
    description: '4-6 slide 16:9 deck with speaker notes (.pptx)',
    icon: Presentation,
    color: '#ff6b00'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn Post',
    description: 'High engagement format with hook, emojis & hashtags',
    icon: Linkedin,
    color: '#0a66c2'
  },
  {
    id: 'twitter',
    label: 'Twitter / X Thread',
    description: '3-5 numbered tweets strictly capped under 280 chars',
    icon: Twitter,
    color: '#38bdf8'
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
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Select Deliverables ({selectedFormats.length}/4)
        </label>
        <button
          type="button"
          onClick={() => onChangeFormats(FORMAT_DEFINITIONS.map(f => f.id))}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--iqoo-cyan)',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: '600'
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
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'rgba(255, 107, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isSelected ? 'var(--iqoo-orange)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                color: isSelected ? 'var(--iqoo-orange)' : 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center'
              }}>
                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color
              }}>
                <Icon size={18} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tone & Audience Selectors */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '6px',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => onChangeTone(e.target.value)}
            style={{
              width: '100%',
              background: '#0a0f1d',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="professional">Professional</option>
            <option value="direct_urgent">Direct & Urgent</option>
            <option value="visionary">Visionary & Inspiring</option>
            <option value="technical">Deep Technical</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => onChangeAudience(e.target.value)}
            style={{
              width: '100%',
              background: '#0a0f1d',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              outline: 'none'
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
