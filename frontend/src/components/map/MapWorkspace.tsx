import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapControls } from './MapControls';
import { MapMetadata } from './MapMetadata';
import { MapOverlayLayer } from './MapOverlayLayer';

import type { InvestigationArea } from '../../types';

interface MapWorkspaceProps {
  lat: number;
  setLat: (lat: number) => void;
  lng: number;
  setLng: (lng: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  setCurrentMapBounds: (bounds: any) => void;
  activeEvidence?: Record<string, any>;
  showBaseContext?: boolean;
  setShowBaseContext?: (val: boolean) => void;
  showInvestigationBoundary?: boolean;
  setShowInvestigationBoundary?: (val: boolean) => void;
  showEvidence?: boolean;
  setShowEvidence?: (val: boolean) => void;
  investigationArea: InvestigationArea | null;
  setInvestigationArea: (aoi: InvestigationArea | null) => void;
  investigationAreaMode: 'idle' | 'draw';
  setInvestigationAreaMode: (mode: 'idle' | 'draw') => void;
  flyToBounds?: [[number, number], [number, number]] | null;
  setFlyToBounds?: (bounds: [[number, number], [number, number]] | null) => void;
}

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  lat, setLat, lng, setLng, zoom, setZoom, setCurrentMapBounds, activeEvidence, 
  showBaseContext = true, setShowBaseContext,
  showInvestigationBoundary = true, setShowInvestigationBoundary,
  showEvidence = true, setShowEvidence,
  investigationArea, setInvestigationArea,
  investigationAreaMode, setInvestigationAreaMode,
  flyToBounds, setFlyToBounds
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const [diagnosticInfo, setDiagnosticInfo] = useState({ loads: 0, errors: 0 });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Map with Zoom Safeguards
    // minZoom: 2 prevents zooming out too far and loading duplicate worlds
    // maxZoom: 18 prevents unnecessary 404s for tiles that don't exist
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 19,
      worldCopyJump: true // Seamless panning across dateline without duplicating tiles
    }).setView([lat, lng], zoom);
    
    // Read the API key from environment variables (checking both potential variable names)
    const apiKey = import.meta.env.VITE_CARTO_API_KEY || import.meta.env.VITE_MAPBOX_TOKEN || '';
    
    // Default to free Esri Dark Canvas basemap (no key required), or CARTO if API key is supplied
    const tileUrl = apiKey 
      ? `https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png?key=${apiKey}`
      : `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`;
    
    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      maxNativeZoom: apiKey ? 18 : 16,
      attribution: apiKey ? '&copy; CARTO' : '&copy; Esri',
      noWrap: true, // Prevents loading tiles outside the standard world bounds
      keepBuffer: 2 // Retains nearby tiles to prevent reloading when panning back
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Session Usage Safeguard
    let sessionTileLoads = 0;
    let sessionTileErrors = 0;
    const USAGE_WARNING_THRESHOLD = 5000;

    tileLayer.on('tileload', () => {
      sessionTileLoads++;
      if (import.meta.env.DEV) {
        setDiagnosticInfo(prev => ({ ...prev, loads: sessionTileLoads }));
      }
      if (sessionTileLoads === USAGE_WARNING_THRESHOLD) {
        console.warn(`[SatQuery Safeguard] High session tile usage detected (${USAGE_WARNING_THRESHOLD} tiles). This is an approximate client-side metric.`);
      }
    });

    tileLayer.on('tileerror', () => {
      sessionTileErrors++;
      if (import.meta.env.DEV) {
        setDiagnosticInfo(prev => ({ ...prev, errors: sessionTileErrors }));
      }
      // Note: Leaflet automatically stops retrying failed tiles, 
      // preventing infinite loops of 404/403 errors.
    });

    // Sync metadata state
    map.on('move', () => {
      const center = map.getCenter();
      setLat(center.lat);
      setLng(center.lng);
      
      const bounds = map.getBounds();
      setCurrentMapBounds({
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
        center: { lat: center.lat, lng: center.lng }
      });
    });

    map.on('zoomend', () => {
      setZoom(map.getZoom());
    });
    
    // Initial bounds sync
    const initialBounds = map.getBounds();
    const initialCenter = map.getCenter();
    setCurrentMapBounds({
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [initialBounds.getWest(), initialBounds.getSouth()],
          [initialBounds.getEast(), initialBounds.getSouth()],
          [initialBounds.getEast(), initialBounds.getNorth()],
          [initialBounds.getWest(), initialBounds.getNorth()],
          [initialBounds.getWest(), initialBounds.getSouth()]
        ]]
      },
      bounds: {
        north: initialBounds.getNorth(),
        south: initialBounds.getSouth(),
        east: initialBounds.getEast(),
        west: initialBounds.getWest()
      },
      center: { lat: initialCenter.lat, lng: initialCenter.lng }
    });

    mapInstanceRef.current = map;
    setMapInstance(map);

    return () => {
      map.off('move');
      map.off('zoomend');
      tileLayer.off('tileload');
      tileLayer.off('tileerror');
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run ONLY once on mount to prevent unnecessary tile reloads

  // Handle Layer Visibility Toggles
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setOpacity(showBaseContext ? 1 : 0);
    }
  }, [showBaseContext]);

  // Handle FlyTo
  useEffect(() => {
    if (flyToBounds && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(flyToBounds, { animate: true, duration: 1.5, padding: [40, 40] });
      if (setFlyToBounds) setFlyToBounds(null);
    }
  }, [flyToBounds, setFlyToBounds]);

  // Handle Draw Mode
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const mapContainer = map.getContainer();

    if (investigationAreaMode === 'draw') {
      map.dragging.disable();
      map.doubleClickZoom.disable();
      mapContainer.style.cursor = 'crosshair';

      let isDrawing = false;
      let startPoint: L.LatLng | null = null;
      let rect: L.Rectangle | null = null;

      const onMouseDown = (e: L.LeafletMouseEvent) => {
        isDrawing = true;
        startPoint = e.latlng;
        rect = L.rectangle(L.latLngBounds(startPoint, startPoint), {
          color: '#ffffff',
          weight: 1,
          dashArray: '4',
          fillColor: '#ffffff',
          fillOpacity: 0.1,
          interactive: false
        }).addTo(map);
      };

      const onMouseMove = (e: L.LeafletMouseEvent) => {
        if (!isDrawing || !startPoint || !rect) return;
        rect.setBounds(L.latLngBounds(startPoint, e.latlng));
      };

      const onMouseUp = () => {
        if (!isDrawing || !startPoint || !rect) return;
        isDrawing = false;
        
        const finalBounds = rect.getBounds();
        const center = finalBounds.getCenter();
        map.removeLayer(rect);
        
        // Prevent accidental micro-clicks from creating tiny areas
        if (finalBounds.getNorthWest().distanceTo(finalBounds.getSouthEast()) > 10) {
          setInvestigationArea({
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [finalBounds.getWest(), finalBounds.getSouth()],
                [finalBounds.getEast(), finalBounds.getSouth()],
                [finalBounds.getEast(), finalBounds.getNorth()],
                [finalBounds.getWest(), finalBounds.getNorth()],
                [finalBounds.getWest(), finalBounds.getSouth()]
              ]]
            },
            bounds: {
              north: finalBounds.getNorth(),
              south: finalBounds.getSouth(),
              east: finalBounds.getEast(),
              west: finalBounds.getWest()
            },
            center: { lat: center.lat, lng: center.lng },
            source: 'drawn',
            createdAt: Date.now()
          });
        }
        
        setInvestigationAreaMode('idle');
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (rect) map.removeLayer(rect);
          isDrawing = false;
          setInvestigationAreaMode('idle');
        }
      };

      map.on('mousedown', onMouseDown);
      map.on('mousemove', onMouseMove);
      map.on('mouseup', onMouseUp);
      document.addEventListener('keydown', onKeyDown);

      return () => {
        map.off('mousedown', onMouseDown);
        map.off('mousemove', onMouseMove);
        map.off('mouseup', onMouseUp);
        document.removeEventListener('keydown', onKeyDown);
        if (rect) map.removeLayer(rect);
        map.dragging.enable();
        map.doubleClickZoom.enable();
        mapContainer.style.cursor = '';
      };
    } else {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      mapContainer.style.cursor = '';
    }
  }, [investigationAreaMode, setInvestigationArea, setInvestigationAreaMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%', zIndex: 0 }} 
      />
      <MapControls 
        map={mapInstance} 
        showBaseContext={showBaseContext}
        setShowBaseContext={setShowBaseContext}
        showInvestigationBoundary={showInvestigationBoundary}
        setShowInvestigationBoundary={setShowInvestigationBoundary}
        showEvidence={showEvidence}
        setShowEvidence={setShowEvidence}
        investigationArea={investigationArea}
        setInvestigationArea={setInvestigationArea}
        setInvestigationAreaMode={setInvestigationAreaMode}
      />
      <MapMetadata 
        lat={lat} lng={lng} zoom={zoom} 
        diagnostics={import.meta.env.DEV ? diagnosticInfo : undefined} 
      />
      
      {/* 
        Future Spatial Overlay Architecture: 
        Pass map instance and backend evidence (GeoJSON/boxes/masks) 
        to a dedicated layer manager.
      */}
      {mapInstance && (
        <MapOverlayLayer 
          map={mapInstance} 
          evidence={activeEvidence} 
          showInvestigationBoundary={showInvestigationBoundary}
          investigationArea={investigationArea}
        />
      )}
    </div>
  );
};
