import React, { useState } from 'react';
import { Compass, CaretDown, Check } from '@phosphor-icons/react';
import { PRESETS, type PresetItem } from '../../types/presets';

export type { PresetItem };

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetItem) => void;
  activePresetId?: string;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset, activePresetId }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (p: PresetItem) => {
    onSelectPreset(p);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)',
          color: 'var(--text-primary)',
          padding: '4px 10px',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
      >
        <Compass size={15} color="#60A5FA" />
        <span style={{ fontWeight: 500 }}>Presets / Benchmarks</span>
        <CaretDown size={12} color="var(--text-secondary)" />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '6px',
            width: '320px',
            background: 'var(--bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-panel)',
            boxShadow: 'var(--shadow-panel)',
            zIndex: 1100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '8px 12px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-disabled)',
              borderBottom: '1px solid var(--color-border)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            ISRO / SAC PS 26167 Showcase Scenarios
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '4px' }}>
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: activePresetId === p.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '3px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
                onMouseOut={e =>
                  (e.currentTarget.style.backgroundColor =
                    activePresetId === p.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent')
                }
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{p.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {p.subtitle}
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      fontSize: '9px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: '#60A5FA',
                      background: 'rgba(59, 130, 246, 0.15)',
                      padding: '1px 5px',
                      borderRadius: '2px',
                    }}
                  >
                    {p.tag}
                  </span>
                </div>
                {activePresetId === p.id && <Check size={14} color="#60A5FA" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
