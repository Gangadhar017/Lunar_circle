import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlass, X, Paperclip, FileImage, ArrowsClockwise } from '@phosphor-icons/react';
import { analyze } from '../../services/api/analysis';
import { ProcessingTrace } from './ProcessingTrace';
import type { AnalysisResponse, InvestigationArea } from '../../types';

interface QuerySurfaceProps {
  lat: number;
  lng: number;
  zoom: number;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  benchmarkMode: boolean;
  demoMode: boolean;
  autoLoadDemoAssets?: boolean;
  showProcessingTrace?: boolean;
  investigationArea?: InvestigationArea | null;
  setInvestigationArea?: (aoi: InvestigationArea | null) => void;
  currentMapBounds?: any;
  onAnalysisComplete: (query: string, result: AnalysisResponse | null, error: string | null, targetLat: number, targetLng: number) => void;
}

export const QuerySurface: React.FC<QuerySurfaceProps> = ({ 
  lat, lng, zoom, files, setFiles, benchmarkMode, demoMode, autoLoadDemoAssets, showProcessingTrace, 
  investigationArea, setInvestigationArea, currentMapBounds,
  onAnalysisComplete
}) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'idle' | 'active' | 'analyzing'>('idle');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (mode !== 'analyzing') {
          setMode('active');
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [mode]);

  // If an investigation is active, and we are not actively typing a new one, stay idle.
  // We don't want to completely hide the query surface, so they can start a new query.

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setMode('analyzing');
    inputRef.current?.blur();
    
    const capturedLat = lat;
    const capturedLng = lng;
    
    let analysisFiles = [...files];

    if (analysisFiles.length === 0) {
      if (demoMode && autoLoadDemoAssets) {
        // Auto load demo assets based on query intent
        try {
          const q = query.toLowerCase();
          const loadedFiles: File[] = [];
          
          const loadFile = async (name: string) => {
            const res = await fetch(`/demo/${name}`);
            const blob = await res.blob();
            return new File([blob], name, { type: 'image/jpeg' });
          };

          if (q.includes('change') || q.includes('develop') || q.includes('compar')) {
            loadedFiles.push(await loadFile('before.jpg'), await loadFile('after.jpg'));
          } else if (q.includes('sar') || q.includes('fusion') || q.includes('both')) {
            loadedFiles.push(await loadFile('optical.jpg'), await loadFile('sar.jpg'));
          } else {
            loadedFiles.push(await loadFile('optical.jpg'));
          }
          
          setFiles(loadedFiles);
          analysisFiles = loadedFiles;
        } catch (err) {
          console.warn("Could not auto-load demo assets.", err);
        }
      }

      if (analysisFiles.length === 0) {
        onAnalysisComplete(query, null, "Integration Gap: Backend requires explicit imagery. Please attach a file (e.g., GeoTIFF).", capturedLat, capturedLng);
        setMode('idle');
        return;
      }
    }

    // Auto-create AOI if none exists
    let activeAoi = investigationArea;
    if (!activeAoi && currentMapBounds) {
      activeAoi = {
        geometry: currentMapBounds.geometry || currentMapBounds,
        bounds: currentMapBounds.bounds,
        center: currentMapBounds.center,
        source: 'auto',
        createdAt: Date.now()
      };
      if (setInvestigationArea) {
        setInvestigationArea(activeAoi);
      }
    }

    try {
      const response = await analyze({
        query,
        images: analysisFiles,
        benchmarkMode: benchmarkMode || demoMode, // Demo mode requires benchmark mode to bypass GeoTIFF validation
        demoMode,
        aoi: activeAoi || undefined
      });
      
      // Artificial delay for UI trace simulation if requested
      if (demoMode && showProcessingTrace) {
        // Wait ~7.2 seconds for the trace to finish
        setTimeout(() => {
          onAnalysisComplete(query, response, null, capturedLat, capturedLng);
          setMode('idle');
          setQuery('');
        }, 7200);
      } else {
        onAnalysisComplete(query, response, null, capturedLat, capturedLng);
        setMode('idle');
        setQuery('');
      }
    } catch (err: any) {
      console.error("API Error", err);
      onAnalysisComplete(query, null, err.message || "Failed to communicate with the analysis backend.", capturedLat, capturedLng);
      setMode('idle');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (mode === 'active') {
        inputRef.current?.blur();
        setMode('idle');
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const suggestions = [
    "Find newly developed regions",
    "Detect changes between two periods",
    "Estimate affected land area",
    "Identify major hydrology boundaries"
  ];

  return (
    <div 
      style={{ 
        position: 'absolute', 
        bottom: mode === 'active' ? '25vh' : '24px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1001,
        width: 'calc(100vw - 48px)',
        maxWidth: '560px',
        transition: 'bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div 
        style={{
          background: mode === 'active' ? 'var(--bg-panel)' : 'rgba(28, 28, 28, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-panel)',
          boxShadow: 'var(--shadow-panel)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'background 0.2s',
        }}
      >
        {mode === 'active' && files.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', padding: '12px 16px 0 16px', flexWrap: 'wrap' }}>
            {files.map((file, idx) => (
              <div key={idx} style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                background: 'rgba(255,255,255,0.05)', padding: '4px 8px', 
                borderRadius: '4px', fontSize: '11px', color: 'var(--text-secondary)',
                border: '1px solid var(--color-border)'
              }}>
                <FileImage size={14} />
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
                <button 
                  onClick={() => removeFile(idx)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            gap: '12px',
          }}
        >
          {mode === 'analyzing' ? (
             <ArrowsClockwise size={20} color="var(--text-secondary)" className="spin" />
          ) : (
             <MagnifyingGlass size={20} color="var(--text-secondary)" weight="light" />
          )}
          <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          
          <input
            ref={inputRef}
            type="text"
            placeholder={mode === 'analyzing' ? "Executing spatial workflow..." : "Press Cmd+K or type to investigate..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setMode('active')}
            onKeyDown={handleKeyDown}
            disabled={mode === 'analyzing'}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              outline: 'none',
              opacity: mode === 'analyzing' ? 0.5 : 1
            }}
          />
          {mode === 'active' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: files.length > 0 ? '#3B82F6' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px'
                  }}
                  title="Attach geospatial imagery"
                >
                  <Paperclip size={16} weight="light" />
                </button>
              </div>

              <span style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)' }}>
                Z{zoom}
              </span>
              <button
                type="submit"
                disabled={!query.trim()}
                style={{
                  background: query.trim() ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.1)',
                  color: query.trim() ? 'var(--bg-base)' : 'var(--text-disabled)',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: query.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}
              >
                Analyze
              </button>
            </div>
          )}
        </form>

        {mode === 'analyzing' && demoMode && showProcessingTrace && (
          <ProcessingTrace scenario={query} />
        )}

        {mode === 'active' && (
          <div style={{ 
            padding: '0 16px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Suggested Investigations
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <MagnifyingGlass size={14} weight="light" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
