import React, { useState } from 'react';
import L from 'leaflet';
import { Plus, Minus, Stack, Cursor, MapTrifold, Trash } from '@phosphor-icons/react';
import type { InvestigationArea } from '../../types';

interface MapControlsProps {
  map: L.Map | null;
  showBaseContext?: boolean;
  setShowBaseContext?: (val: boolean) => void;
  showInvestigationBoundary?: boolean;
  setShowInvestigationBoundary?: (val: boolean) => void;
  showEvidence?: boolean;
  setShowEvidence?: (val: boolean) => void;
  investigationArea?: InvestigationArea | null;
  setInvestigationArea?: (aoi: InvestigationArea | null) => void;
  setInvestigationAreaMode?: (mode: 'idle' | 'draw') => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ 
  map, 
  showBaseContext, setShowBaseContext,
  showInvestigationBoundary, setShowInvestigationBoundary,
  showEvidence, setShowEvidence,
  investigationArea, setInvestigationArea,
  setInvestigationAreaMode
}) => {
  const [layersOpen, setLayersOpen] = useState(false);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();

  const handleUseCurrentView = () => {
    if (!map || !setInvestigationArea) return;
    const bounds = map.getBounds();
    const center = map.getCenter();
    setInvestigationArea({
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [bounds.getWest(), bounds.getSouth()],
          [bounds.getEast(), bounds.getSouth()],
          [bounds.getEast(), bounds.getNorth()],
          [bounds.getWest(), bounds.getNorth()],
          [bounds.getWest(), bounds.getSouth()]
        ]]
      },
      bounds: {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      },
      center: { lat: center.lat, lng: center.lng },
      source: 'current_view',
      createdAt: Date.now()
    });
    setLayersOpen(false);
  };

  const handleClearAOI = () => {
    if (setInvestigationArea) setInvestigationArea(null);
    setLayersOpen(false);
  };

  const handleDrawAOI = () => {
    if (setInvestigationAreaMode) setInvestigationAreaMode('draw');
    setLayersOpen(false);
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-panel)',
            borderRadius: 'var(--radius-panel)',
            boxShadow: 'var(--shadow-panel)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            aria-label="Toggle map layers"
            style={{
              background: layersOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = layersOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent')}
          >
            <Stack size={20} weight="light" />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-panel)',
            borderRadius: 'var(--radius-panel)',
            boxShadow: 'var(--shadow-panel)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              color: 'var(--text-primary)',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Plus size={20} weight="light" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Minus size={20} weight="light" />
          </button>
        </div>

        {/* Investigation Area Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-panel)',
            borderRadius: 'var(--radius-panel)',
            boxShadow: 'var(--shadow-panel)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <button
            title="Draw Investigation Area"
            onClick={handleDrawAOI}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              color: 'var(--text-primary)',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Cursor size={20} weight="light" />
          </button>
          <button
            title="Use Current Map View"
            onClick={handleUseCurrentView}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: investigationArea ? '1px solid var(--color-border)' : 'none',
              color: 'var(--text-primary)',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <MapTrifold size={20} weight="light" />
          </button>
          {investigationArea && (
            <button
              title="Clear Investigation Area"
              onClick={handleClearAOI}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FCA5A5',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Trash size={20} weight="light" />
            </button>
          )}
        </div>
      </div>

      {layersOpen && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '72px',
          width: '260px',
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
            <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>MAP LAYERS</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 600, textTransform: 'uppercase' }}>Base Context</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={showBaseContext} onChange={e => setShowBaseContext && setShowBaseContext(e.target.checked)} />
                Geographic Map
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 600, textTransform: 'uppercase' }}>Analysis Layers</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={showInvestigationBoundary} onChange={e => setShowInvestigationBoundary && setShowInvestigationBoundary(e.target.checked)} />
                Investigation Boundary
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={showEvidence} onChange={e => setShowEvidence && setShowEvidence(e.target.checked)} />
                Spatial Evidence
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
