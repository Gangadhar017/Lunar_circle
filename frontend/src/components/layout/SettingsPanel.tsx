import React, { useState } from 'react';
import { Gear, X } from '@phosphor-icons/react';

interface SettingsPanelProps {
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  showProcessingTrace: boolean;
  setShowProcessingTrace: (val: boolean) => void;
  autoLoadDemoAssets: boolean;
  setAutoLoadDemoAssets: (val: boolean) => void;
  mapContext: 'geographic' | 'minimal' | 'hidden';
  setMapContext: (val: 'geographic' | 'minimal' | 'hidden') => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  demoMode, setDemoMode,
  showProcessingTrace, setShowProcessingTrace,
  autoLoadDemoAssets, setAutoLoadDemoAssets,
  mapContext, setMapContext
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Workspace Settings"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          borderRadius: 'var(--radius-panel)',
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <Gear size={20} weight="light" />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '24px',
          width: '320px',
          background: 'var(--bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-panel)',
          boxShadow: 'var(--shadow-panel)',
          padding: '16px',
          zIndex: 1100,
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          pointerEvents: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>WORKSPACE SETTINGS</h2>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={demoMode} onChange={e => setDemoMode(e.target.checked)} />
              Demo Mode
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', opacity: demoMode ? 1 : 0.5 }}>
              <input type="checkbox" checked={showProcessingTrace} onChange={e => setShowProcessingTrace(e.target.checked)} disabled={!demoMode} />
              Show Processing Trace
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', opacity: demoMode ? 1 : 0.5 }}>
              <input type="checkbox" checked={autoLoadDemoAssets} onChange={e => setAutoLoadDemoAssets(e.target.checked)} disabled={!demoMode} />
              Auto-load Demo Assets
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>MAP CONTEXT</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', background: mapContext === 'geographic' ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                <input type="radio" name="mapContext" value="geographic" checked={mapContext === 'geographic'} onChange={() => setMapContext('geographic')} style={{ display: 'none' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mapContext === 'geographic' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60A5FA' }} />}
                </div>
                Geographic Context
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', background: mapContext === 'minimal' ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                <input type="radio" name="mapContext" value="minimal" checked={mapContext === 'minimal'} onChange={() => setMapContext('minimal')} style={{ display: 'none' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mapContext === 'minimal' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60A5FA' }} />}
                </div>
                Minimal Context
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', background: mapContext === 'hidden' ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                <input type="radio" name="mapContext" value="hidden" checked={mapContext === 'hidden'} onChange={() => setMapContext('hidden')} style={{ display: 'none' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mapContext === 'hidden' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60A5FA' }} />}
                </div>
                Hide Map
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
