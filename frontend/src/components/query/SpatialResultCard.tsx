import React, { useState } from 'react';
import { X, HardDrives, WarningCircle, CheckCircle, CaretRight, CaretDown, ShieldWarning, FileText, ArrowsLeftRight } from '@phosphor-icons/react';
import type { AnalysisResponse } from '../../types';
import { ReportModal } from './ReportModal';

interface SpatialResultCardProps {
  analysis: {
    query: string;
    targetLat: number;
    targetLng: number;
    result: AnalysisResponse | null;
    error: string | null;
  };
  investigationArea?: any;
  onFlyTo?: (bounds: [[number, number], [number, number]]) => void;
  onClose: () => void;
  onOpenSwipe?: () => void;
  canSwipe?: boolean;
}

export const SpatialResultCard: React.FC<SpatialResultCardProps> = ({ 
  analysis, 
  investigationArea, 
  onFlyTo, 
  onClose,
  onOpenSwipe,
  canSwipe = false,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const { query, result, error } = analysis;

  const isNotTrainedYet = result?.ok === false && result?.execution_summary?.error === 'weights_not_attached';

  return (
    <>
      {reportOpen && (
        <ReportModal 
          analysis={analysis} 
          investigationArea={investigationArea} 
          onClose={() => setReportOpen(false)} 
        />
      )}
    <div className="spatial-result-card">
      {/* Header */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '12px 16px', borderBottom: '1px solid var(--color-border)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <HardDrives size={16} />
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
            Investigation Result
          </span>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
          aria-label="Close results"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Demo Mode Badge */}
        {result?.execution_summary?.mode === 'demo' && (
          <div style={{ 
            alignSelf: 'flex-start',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#60A5FA',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            Curated Demo Inference
          </div>
        )}

        {/* Investigation Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
            "{query}"
          </div>
          
          {investigationArea && (
            <div style={{ 
              marginTop: '8px',
              padding: '12px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: '4px', 
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '4px' }}>
                Investigation Context
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-disabled)' }}>Source:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {investigationArea.source === 'drawn' ? 'Drawn Area' : investigationArea.source === 'current_view' ? 'Current Map View' : 'Automatic Context'}
                </span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-disabled)' }}>Center:</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {investigationArea.center.lat.toFixed(4)}, {investigationArea.center.lng.toFixed(4)}
                </span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-disabled)' }}>Coverage:</span>
                <span style={{ color: 'var(--text-primary)' }}>Demo-derived estimate</span>
              </div>
              
              {result?.evidence && Object.keys(result.evidence).length > 0 && onFlyTo && (
                <button 
                  onClick={() => {
                    // Extract bounds from evidence or fallback to AOI
                    let targetBounds: [[number, number], [number, number]] | null = null;
                    if (result.evidence.geojson) {
                      // Note: For demo we just fly to the AOI bounds to ensure it's in view
                      targetBounds = [
                        [investigationArea.bounds.south, investigationArea.bounds.west],
                        [investigationArea.bounds.north, investigationArea.bounds.east]
                      ];
                    }
                    if (targetBounds) onFlyTo(targetBounds);
                  }}
                  style={{ 
                    marginTop: '8px',
                    background: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    color: '#60A5FA', 
                    padding: '6px', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                >
                  View Evidence on Map
                </button>
              )}
            </div>
          )}
        </div>

        {/* State / Response */}
        {error ? (
          <div style={{ 
            padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '2px solid #EF4444',
            color: '#FCA5A5', fontSize: '13px', lineHeight: '1.5', display: 'flex', gap: '8px'
          }}>
            <WarningCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>System Error</div>
              {error}
            </div>
          </div>
        ) : result && isNotTrainedYet ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '2px solid #F59E0B',
              color: '#FCD34D', fontSize: '13px', lineHeight: '1.5', display: 'flex', gap: '8px'
            }}>
              <ShieldWarning size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>Analysis Engine Unavailable</div>
                Your request successfully reached the backend pipeline and the data passed validation. However, the specific geospatial model weights required for this analysis are not currently attached to the service.
              </div>
            </div>
          </div>
        ) : result && result.ok ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Primary Finding */}
            <div style={{ 
              padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderLeft: '2px solid #22C55E',
              color: '#86EFAC', fontSize: '13px', lineHeight: '1.5', display: 'flex', gap: '8px'
            }}>
              <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Primary Finding</div>
                {result.answer}
              </div>
            </div>

            {/* Summary & Observations */}
            {(result.summary || result.observations) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                {result.summary && (
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {result.summary}
                  </div>
                )}
                
                {result.observations && Object.keys(result.observations).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Structured Observations
                    </div>
                    {Object.entries(result.observations).map(([category, items]) => (
                      <div key={category} style={{ fontSize: '12px' }}>
                        <span style={{ color: '#60A5FA', fontWeight: 500 }}>{category}:</span>
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', color: 'var(--text-primary)' }}>
                          {items.map((item, i) => <li key={i} style={{ marginBottom: '2px' }}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Confidence */}
            {result.confidence > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>Confidence Score:</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.confidence * 100}%`, height: '100%', background: result.confidence > 0.8 ? '#10B981' : '#F59E0B' }} />
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{(result.confidence * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        ) : result ? (
          <div style={{ 
            padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '2px solid #EF4444',
            color: '#FCA5A5', fontSize: '13px', lineHeight: '1.5', display: 'flex', gap: '8px'
          }}>
            <WarningCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>Validation Failed</div>
              {result.answer}
            </div>
          </div>
        ) : null}

        {/* Technical Details & Actions */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setReportOpen(true)}
              style={{
                flex: 1,
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60A5FA',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.22)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)')}
            >
              <FileText size={14} /> Mission Report
            </button>

            {canSwipe && onOpenSwipe && (
              <button
                onClick={onOpenSwipe}
                style={{
                  flex: 1,
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34D399',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.22)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)')}
              >
                <ArrowsLeftRight size={14} /> Swipe Compare
              </button>
            )}
          </div>

          {result && result.execution_summary && (
            <div>
              <button 
                onClick={() => setDetailsOpen(!detailsOpen)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 0', fontSize: '11px', fontWeight: 500
                }}
              >
                {detailsOpen ? <CaretDown size={13} /> : <CaretRight size={13} />}
                Auditable execution details
              </button>
              
              {detailsOpen && (
                <div style={{
                  marginTop: '6px', padding: '10px', background: 'var(--bg-base)',
                  borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)',
                  color: 'var(--text-disabled)', whiteSpace: 'pre-wrap',
                  maxHeight: '160px', overflowY: 'auto'
                }}>
                  {JSON.stringify(result.execution_summary, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
};
