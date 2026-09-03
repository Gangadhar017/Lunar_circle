import React from 'react';
import { SettingsPanel } from './SettingsPanel';
import { PresetSelector, type PresetItem } from './PresetSelector';

interface WorkspaceHeaderProps {
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  showProcessingTrace: boolean;
  setShowProcessingTrace: (val: boolean) => void;
  autoLoadDemoAssets: boolean;
  setAutoLoadDemoAssets: (val: boolean) => void;
  mapContext: 'geographic' | 'minimal' | 'hidden';
  setMapContext: (val: 'geographic' | 'minimal' | 'hidden') => void;
  onSelectPreset?: (preset: PresetItem) => void;
  activePresetId?: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = (props) => {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1
          style={{
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          SatQuery AI
        </h1>
        <span style={{ 
          fontSize: '10px', 
          fontFamily: 'var(--font-mono)', 
          color: '#60A5FA',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '2px 6px',
          borderRadius: '3px',
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          ISRO / SAC &bull; PS 26167
        </span>

        {props.onSelectPreset && (
          <PresetSelector 
            onSelectPreset={props.onSelectPreset} 
            activePresetId={props.activePresetId} 
          />
        )}
      </div>

      <div style={{ pointerEvents: 'auto' }}>
        <SettingsPanel {...props} />
      </div>
    </header>
  );
};
