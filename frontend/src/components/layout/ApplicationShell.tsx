import React, { useState } from 'react';
import { MapWorkspace } from '../map/MapWorkspace';
import { WorkspaceHeader } from './WorkspaceHeader';
import { QuerySurface } from '../query/QuerySurface';
import { SpatialResultCard } from '../query/SpatialResultCard';
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
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', overflow: 'hidden', background: mapContext === 'hidden' ? '#111' : undefined }}>
      <WorkspaceHeader 
        demoMode={demoMode} setDemoMode={setDemoMode}
        showProcessingTrace={showProcessingTrace} setShowProcessingTrace={setShowProcessingTrace}
        autoLoadDemoAssets={autoLoadDemoAssets} setAutoLoadDemoAssets={setAutoLoadDemoAssets}
        mapContext={mapContext} setMapContext={setMapContext}
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
      </div>

      {activeAnalysis && (
         <SpatialResultCard 
           analysis={activeAnalysis}
           onClose={handleCloseAnalysis}
           investigationArea={investigationArea}
           onFlyTo={setFlyToBounds}
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
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  );
};
