import React from 'react';

interface MapMetadataProps {
  lat: number;
  lng: number;
  zoom: number;
  epsg?: string;
  diagnostics?: { loads: number; errors: number };
}

export const MapMetadata: React.FC<MapMetadataProps> = ({ lat, lng, zoom, epsg = 'EPSG:3857', diagnostics }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
        pointerEvents: 'none',
      }}
    >
      {diagnostics && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-secondary)',
            display: 'flex',
            gap: '8px',
            marginBottom: '4px'
          }}
        >
          <span>TILES {diagnostics.loads}</span>
          <span>ERRORS {diagnostics.errors}</span>
        </div>
      )}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          backgroundColor: 'rgba(18, 18, 18, 0.4)',
          backdropFilter: 'blur(4px)',
          padding: '2px 6px',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        {lat.toFixed(5)}°, {lng.toFixed(5)}°
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-disabled)',
        }}
      >
        {epsg} • Z{zoom}
      </div>
    </div>
  );
};
