import React, { useEffect } from 'react';
import L from 'leaflet';
import type { InvestigationArea } from '../../types';

interface MapOverlayLayerProps {
  map: L.Map;
  evidence?: Record<string, any>;
  showInvestigationBoundary?: boolean;
  investigationArea?: InvestigationArea | null;
}

export const MapOverlayLayer: React.FC<MapOverlayLayerProps> = ({ 
  map, evidence, showInvestigationBoundary = true, investigationArea 
}) => {
  useEffect(() => {
    if (!map) return;

    const overlayGroup = L.layerGroup().addTo(map);

    if (evidence && evidence.geojson) {
      const geojsonLayer = L.geoJSON(evidence.geojson, {
        style: (feature) => {
          // Professional GIS analytical style
          const isChange = feature?.properties?.type === 'change_polygon';
          return {
            color: isChange ? '#F59E0B' : '#3B82F6', // Warm for change, cool for grounding
            weight: 2,
            fillOpacity: 0.1,
            dashArray: isChange ? '4, 4' : '', // Dashed border for change
          };
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties?.label) {
            const confidence = feature.properties.confidence 
              ? `<br/><span style="color:var(--text-disabled); font-size:10px;">Confidence: ${(feature.properties.confidence * 100).toFixed(1)}%</span>` 
              : '';
            const note = feature.properties.note 
              ? `<br/><span style="color:#F59E0B; font-size:10px; text-transform:uppercase;">${feature.properties.note}</span>` 
              : '';
            
            layer.bindTooltip(`
              <div style="font-family:var(--font-ui); font-size:12px; font-weight:500;">
                ${feature.properties.label}
                ${confidence}
                ${note}
              </div>
            `, { direction: 'top', className: 'gis-tooltip' });
          }
        }
      });
      overlayGroup.addLayer(geojsonLayer);
    }

    // Render AOI
    if (showInvestigationBoundary && investigationArea && investigationArea.geometry) {
      const aoiLayer = L.geoJSON(investigationArea.geometry, {
        style: {
          color: 'rgba(255, 255, 255, 0.4)',
          weight: 1,
          dashArray: '4',
          fillColor: 'rgba(255, 255, 255, 0.05)',
          fillOpacity: 1
        }
      });
      aoiLayer.bindTooltip('INVESTIGATION AREA', { permanent: false, direction: 'center', className: 'aoi-tooltip' });
      overlayGroup.addLayer(aoiLayer);
    }

    return () => {
      // Clean up overlay when the result is closed or changes
      overlayGroup.clearLayers();
      map.removeLayer(overlayGroup);
    };
  }, [map, evidence, showInvestigationBoundary, investigationArea]);

  return (
    <style>{`
      .gis-tooltip {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: var(--text-primary) !important;
        font-family: var(--font-mono);
        font-size: 11px;
        text-shadow: 0 1px 4px rgba(0,0,0,0.8);
      }
      .aoi-tooltip {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: rgba(255, 255, 255, 0.6) !important;
        font-family: var(--font-mono);
        font-size: 10px;
        letter-spacing: 0.1em;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      }
    `}</style>
  );
};
