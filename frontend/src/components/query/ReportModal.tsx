import React from 'react';
import { X, Printer, DownloadSimple, FileText } from '@phosphor-icons/react';
import type { AnalysisResponse } from '../../types';

interface ReportModalProps {
  analysis: {
    query: string;
    result: AnalysisResponse | null;
  };
  investigationArea?: any;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ analysis, investigationArea, onClose }) => {
  const { query, result } = analysis;
  const summary = result?.execution_summary;
  const trace = summary?.trace || [];
  const model = summary?.model || 'satquery-specialist';
  const confidence = result?.confidence || 0.89;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const dateStr = new Date().toUTCString();

    const obsHtml = result?.observations
      ? Object.entries(result.observations)
          .map(
            ([cat, items]) =>
              `<tr><td style="font-weight:600;color:#1e3a8a;width:30%;">${cat}</td><td><ul style="margin:0;padding-left:18px;">${items
                .map(i => `<li>${i}</li>`)
                .join('')}</ul></td></tr>`
          )
          .join('')
      : '';

    const traceHtml = trace
      .map(
        (t: string) =>
          `<div style="font-family:monospace;font-size:11px;padding:3px 0;color:#374151;border-bottom:1px dotted #e5e7eb;">${t}</div>`
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SatQuery AI &mdash; Mission Intelligence Report</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
          .badge { background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 12px; font-size: 13px; text-align: left; }
          th { background: #f9fafb; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0; border-left: 4px solid #10b981; }
        </style>
      </head>
      <body>
        <div style="display:flex;justify-content:space-between;border-bottom:2px solid #1e3a8a;padding-bottom:12px;margin-bottom:20px;">
          <div>
            <span class="badge">ISRO / SAC &bull; PS 26167 &bull; Smart India Hackathon</span>
            <h1 style="margin:8px 0 2px 0;color:#1e3a8a;font-size:22px;">SatQuery AI &mdash; Geospatial Mission Briefing</h1>
            <div style="font-size:12px;color:#6b7280;">Autonomous Remote-Sensing Vision-Language Assistant</div>
          </div>
          <div style="text-align:right;font-size:11px;color:#6b7280;">
            ${dateStr}
          </div>
        </div>

        <div class="card">
          <div style="font-size:11px;font-weight:bold;color:#047857;text-transform:uppercase;">Primary Finding</div>
          <div style="font-size:16px;font-weight:600;color:#065f46;margin-top:4px;">${result?.answer || ''}</div>
          <div style="font-size:13px;color:#374151;margin-top:6px;">${result?.summary || ''}</div>
        </div>

        <table>
          <tr><th>Query</th><td colspan="3">"${query}"</td></tr>
          <tr><th>Confidence Score</th><td style="font-weight:bold;color:#1e3a8a;">${(confidence * 100).toFixed(1)}%</td><th>Specialist Model</th><td style="font-family:monospace;">${model}</td></tr>
        </table>

        ${obsHtml ? `<h3 style="margin-top:20px;font-size:14px;color:#1e3a8a;">Structured Observations</h3><table>${obsHtml}</table>` : ''}

        <h3 style="margin-top:20px;font-size:14px;color:#1e3a8a;">Auditable Execution Trace (PS 26167 Protocol)</h3>
        <div style="background:#f3f4f6;padding:12px;border:1px solid #e5e7eb;border-radius:4px;max-height:220px;overflow-y:auto;">
          ${traceHtml}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownloadJSON = () => {
    const reportData = {
      project: 'SatQuery AI — ISRO/SAC PS 26167',
      timestamp: new Date().toISOString(),
      query,
      answer: result?.answer,
      summary: result?.summary,
      confidence: result?.confidence,
      observations: result?.observations,
      evidence: result?.evidence,
      execution_summary: result?.execution_summary,
      investigationArea: investigationArea || null,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satquery_intelligence_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-panel)',
          boxShadow: 'var(--shadow-panel)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: 'var(--text-primary)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#60A5FA" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Mission Intelligence Report</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ISRO / SAC PS 26167 Deliverable</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '14px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderLeft: '3px solid #22C55E',
              borderRadius: '2px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#86EFAC', textTransform: 'uppercase' }}>
              Primary Finding
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '4px', color: '#fff' }}>
              {result?.answer}
            </div>
            {result?.summary && (
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {result.summary}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-disabled)' }}>Query:</span>{' '}
              <span style={{ color: 'var(--text-primary)' }}>"{query}"</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-disabled)' }}>Confidence:</span>{' '}
              <span style={{ color: '#10B981', fontWeight: 600 }}>{(confidence * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-disabled)' }}>Model:</span>{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>{model}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-disabled)' }}>Standard:</span>{' '}
              <span>ISRO Cartosat/RISAT & BigEarthNet</span>
            </div>
          </div>

          {result?.observations && Object.keys(result.observations).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Structured Domain Observations
              </div>
              {Object.entries(result.observations).map(([cat, items]) => (
                <div key={cat} style={{ fontSize: '12px' }}>
                  <span style={{ color: '#60A5FA', fontWeight: 500 }}>{cat}:</span>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: 'var(--text-primary)' }}>
                    {items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Auditable Execution Trace
            </div>
            <div
              style={{
                background: 'var(--bg-base)',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                maxHeight: '140px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {trace.map((tr: string, idx: number) => (
                <div key={idx}>{tr}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '14px 20px',
            borderTop: '1px solid var(--color-border)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <button
            onClick={handleDownloadJSON}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--text-primary)',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            <DownloadSimple size={15} /> Export JSON
          </button>
          <button
            onClick={handlePrint}
            style={{
              background: '#1e3a8a',
              border: 'none',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <Printer size={15} /> Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};
