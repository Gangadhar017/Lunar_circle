import React, { useState } from 'react';
import { MapWorkspace } from '../map/MapWorkspace';
import { WorkspaceHeader } from './WorkspaceHeader';
import { QuerySurface } from '../query/QuerySurface';
import { SpatialResultCard } from '../query/SpatialResultCard';
import { MapSwipeControl } from '../map/MapSwipeControl';
import type { PresetItem } from './PresetSelector';
import type { AnalysisResponse, InvestigationArea } from '../../types';

export const ApplicationShell: React.FC = () => {
  // Global map context state
  const [lat, setLat] = useState(23.0526);
  const [lng, setLng] = useState(72.5208);
  const [zoom, setZoom] = useState(13);
  const [currentMapBounds, setCurrentMapBounds] = useState<any>(null); // Full AOI geometry/bounds payload
  const [flyToBounds, setFlyToBounds] = useState<[[number, number], [number, number]] | null>(null);

  // Settings state
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [showProcessingTrace, setShowProcessingTrace] = useState<boolean>(true);
  const [autoLoadDemoAssets, setAutoLoadDemoAssets] = useState<boolean>(true);
  const [mapContext, setMapContext] = useState<'geographic' | 'minimal' | 'hidden'>('geographic');

  // Preset & Swipe state
  const [activePresetId, setActivePresetId] = useState<string>('');
  const [presetQuery, setPresetQuery] = useState<string>('');
  const [swipeOpen, setSwipeOpen] = useState<boolean>(false);
  const [swipeLayers, setSwipeLayers] = useState<{ layer1: string; layer2: string; label1: string; label2: string } | null>(null);

  // Layers state
  const [showBaseContext, setShowBaseContext] = useState<boolean>(true);
  const [showInvestigationBoundary, setShowInvestigationBoundary] = useState<boolean>(true);
  const [showEvidence, setShowEvidence] = useState<boolean>(true);

  // Investigation Area State
  const [investigationArea, setInvestigationArea] = useState<InvestigationArea | null>(null);
  const [investigationAreaMode, setInvestigationAreaMode] = useState<'idle' | 'draw'>('idle');

  // Global analysis input state
  const [files, setFiles] = useState<File[]>([]);
  const [benchmarkMode] = useState<boolean>(false);

  // Investigation context
  const [activeAnalysis, setActiveAnalysis] = useState<{
    query: string;
    targetLat: number;
    targetLng: number;
    result: AnalysisResponse | null;
    error: string | null;
  } | null>(null);

  const handleSelectPreset = async (preset: PresetItem) => {
    setActivePresetId(preset.id);
    setPresetQuery(preset.query);
    setLat(preset.lat);
    setLng(preset.lng);
    setZoom(preset.zoom);
    setFlyToBounds([
      [preset.lat - 0.02, preset.lng - 0.02],
      [preset.lat + 0.02, preset.lng + 0.02]
    ]);

    setInvestigationArea({
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [preset.lng - 0.02, preset.lat - 0.015],
          [preset.lng + 0.02, preset.lat - 0.015],
          [preset.lng + 0.02, preset.lat + 0.015],
          [preset.lng - 0.02, preset.lat + 0.015],
          [preset.lng - 0.02, preset.lat - 0.015]
        ]]
      },
      bounds: {
        north: preset.lat + 0.015,
        south: preset.lat - 0.015,
        east: preset.lng + 0.02,
        west: preset.lng - 0.02
      },
      center: { lat: preset.lat, lng: preset.lng },
      source: 'auto',
      createdAt: Date.now()
    });

    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const loaded: File[] = [];
      for (const imgName of preset.images) {
        const res = await fetch(`${baseUrl}demo/${imgName}`);
        const blob = await res.blob();
        loaded.push(new File([blob], imgName, { type: 'image/jpeg' }));
      }
      setFiles(loaded);
    } catch (e) {
      console.warn("Could not load preset images", e);
    }
  };

  const handleAnalysisComplete = (query: string, result: AnalysisResponse | null, error: string | null, targetLat: number, targetLng: number) => {
    setActiveAnalysis({
      query,
      targetLat,
      targetLng,
      result,
      error
    });
  };

  const handleCloseAnalysis = () => {
    setActiveAnalysis(null);
    setSwipeOpen(false);
  };

  const isChangeOrFusion = activeAnalysis?.result?.execution_summary?.task === 'change' || 
                         activeAnalysis?.result?.execution_summary?.task === 'fusion' ||
                         activeAnalysis?.query.toLowerCase().includes('change') ||
                         activeAnalysis?.query.toLowerCase().includes('sar') ||
                         activeAnalysis?.query.toLowerCase().includes('optical');

  const handleOpenSwipe = () => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const isChange = activeAnalysis?.result?.execution_summary?.task === 'change' || 
                     activeAnalysis?.query.toLowerCase().includes('change');
    if (isChange) {
      setSwipeLayers({
        layer1: `${baseUrl}demo/before.jpg`,
        layer2: `${baseUrl}demo/after.jpg`,
        label1: 'Pre-Event (T1)',
        label2: 'Post-Event (T2)'
      });
    } else {
      setSwipeLayers({
        layer1: `${baseUrl}demo/optical.jpg`,
        layer2: `${baseUrl}demo/sar.jpg`,
        label1: 'Optical (RGB)',
        label2: 'SAR Backscatter (VV)'
      });
    }
    setSwipeOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', overflow: 'hidden', background: mapContext === 'hidden' ? '#111' : undefined }}>
      <WorkspaceHeader 
        demoMode={demoMode} setDemoMode={setDemoMode}
        showProcessingTrace={showProcessingTrace} setShowProcessingTrace={setShowProcessingTrace}
        autoLoadDemoAssets={autoLoadDemoAssets} setAutoLoadDemoAssets={setAutoLoadDemoAssets}
        mapContext={mapContext} setMapContext={setMapContext}
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
      />
      
      <div style={{ flex: 1, position: 'relative', opacity: mapContext === 'hidden' ? 0 : mapContext === 'minimal' ? 0.3 : 1, transition: 'opacity 0.3s' }}>
        <MapWorkspace 
          lat={lat} setLat={setLat}
          lng={lng} setLng={setLng}
          zoom={zoom} setZoom={setZoom}
          setCurrentMapBounds={setCurrentMapBounds}
          flyToBounds={flyToBounds}
          setFlyToBounds={setFlyToBounds}
          activeEvidence={showEvidence ? activeAnalysis?.result?.evidence : undefined}
          showBaseContext={showBaseContext} setShowBaseContext={setShowBaseContext}
          showInvestigationBoundary={showInvestigationBoundary} setShowInvestigationBoundary={setShowInvestigationBoundary}
          showEvidence={showEvidence} setShowEvidence={setShowEvidence}
          investigationArea={investigationArea}
          setInvestigationArea={setInvestigationArea}
          investigationAreaMode={investigationAreaMode}
          setInvestigationAreaMode={setInvestigationAreaMode}
        />

        {swipeOpen && swipeLayers && (
          <MapSwipeControl 
            layer1Url={swipeLayers.layer1}
            layer2Url={swipeLayers.layer2}
            label1={swipeLayers.label1}
            label2={swipeLayers.label2}
            onClose={() => setSwipeOpen(false)}
          />
        )}
      </div>

      {activeAnalysis && (
         <SpatialResultCard 
           analysis={activeAnalysis}
           onClose={handleCloseAnalysis}
           investigationArea={investigationArea}
           onFlyTo={setFlyToBounds}
           canSwipe={isChangeOrFusion}
           onOpenSwipe={handleOpenSwipe}
         />
      )}

      <QuerySurface 
        lat={lat} lng={lng} zoom={zoom} 
        files={files} setFiles={setFiles}
        benchmarkMode={benchmarkMode}
        demoMode={demoMode}
        autoLoadDemoAssets={autoLoadDemoAssets}
        showProcessingTrace={showProcessingTrace}
        investigationArea={investigationArea}
        setInvestigationArea={setInvestigationArea}
        currentMapBounds={currentMapBounds}
        externalQuery={presetQuery}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  );
};
