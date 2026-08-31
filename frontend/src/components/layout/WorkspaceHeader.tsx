import React from 'react';
import { SettingsPanel } from './SettingsPanel';

interface WorkspaceHeaderProps {
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  showProcessingTrace: boolean;
  setShowProcessingTrace: (val: boolean) => void;
  autoLoadDemoAssets: boolean;
  setAutoLoadDemoAssets: (val: boolean) => void;
  mapContext: 'geographic' | 'minimal' | 'hidden';
  setMapContext: (val: 'geographic' | 'minimal' | 'hidden') => void;
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
      <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          SatQuery
        </h1>
        <span style={{ 
          fontSize: '10px', 
          fontFamily: 'var(--font-mono)', 
          color: 'var(--text-secondary)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '2px 6px',
          borderRadius: '2px'
        }}>
          WORKSPACE
        </span>
      </div>

      <div style={{ pointerEvents: 'auto' }}>
        <SettingsPanel {...props} />
      </div>
    </header>
  );
};
