"""Report generator for SatQuery AI.

Generates ISRO / SAC PS 26167 compliant Mission Intelligence Reports
containing spatial footprints, model findings, structured observations,
confidence scores, and the complete auditable execution trace.
"""
from __future__ import annotations
import json
import time
from typing import Any


def generate_html_report(execution_data: dict[str, Any]) -> str:
    """Generates a self-contained, printable HTML mission intelligence report."""
    query = execution_data.get("query", "N/A")
    task = execution_data.get("task", "general_vqa").upper()
    answer = execution_data.get("answer", "No answer recorded.")
    summary = execution_data.get("summary", "")
    confidence = execution_data.get("confidence", 0.0)
    observations = execution_data.get("observations", {})
    summary_dict = execution_data.get("execution_summary", {})
    trace = summary_dict.get("trace", [])
    model = summary_dict.get("model", "satquery-specialist")
    params = summary_dict.get("params", {})
    aoi = params.get("aoi", {})
    bounds = aoi.get("bounds", {}) if aoi else {}
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())

    obs_rows = ""
    for category, items in observations.items():
        items_html = "".join(f"<li>{item}</li>" for item in items)
        obs_rows += f"""
        <tr>
            <td style="font-weight: 600; color: #1e3a8a; width: 30%;">{category}</td>
            <td><ul style="margin: 0; padding-left: 18px;">{items_html}</ul></td>
        </tr>
        """

    trace_items = "".join(f"<div style='font-family: monospace; font-size: 11px; padding: 3px 0; color: #374151; border-bottom: 1px dotted #e5e7eb;'>{t}</div>" for t in trace)

    bounds_str = "Global View / Unbounded"
    if bounds:
        bounds_str = f"N: {bounds.get('north', 0):.4f}°, S: {bounds.get('south', 0):.4f}°, E: {bounds.get('east', 0):.4f}°, W: {bounds.get('west', 0):.4f}°"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SatQuery AI — Mission Intelligence Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 36px;
            line-height: 1.5;
        }}
        @media print {{
            body {{ padding: 12px; }}
            .no-print {{ display: none; }}
        }}
        .header {{
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }}
        .badge {{
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }}
        .metric-card {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 20px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }}
        th, td {{
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            text-align: left;
            font-size: 13px;
        }}
        th {{ background: #f9fafb; font-weight: 600; }}
        .trace-box {{
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 12px;
            max-height: 240px;
            overflow-y: auto;
        }}
        .btn-print {{
            background: #1e3a8a;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            font-size: 13px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="badge">ISRO / SAC &bull; PS 26167 &bull; Smart India Hackathon</div>
            <h1 style="margin: 8px 0 4px 0; font-size: 24px; color: #1e3a8a;">SatQuery AI &mdash; Geospatial Intelligence Report</h1>
            <div style="font-size: 12px; color: #6b7280;">Autonomous Agentic Remote-Sensing Vision-Language Analysis</div>
        </div>
        <div style="text-align: right;">
            <button class="btn-print no-print" onclick="window.print()">Print / Save as PDF</button>
            <div style="font-size: 11px; color: #6b7280; margin-top: 6px;">Generated: {timestamp}</div>
        </div>
    </div>

    <!-- Executive Summary -->
    <div class="metric-card" style="border-left: 4px solid #10b981;">
        <div style="font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase;">Primary Finding</div>
        <div style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #065f46;">{answer}</div>
        {f'<div style="font-size: 13px; color: #374151; margin-top: 6px;">{summary}</div>' if summary else ''}
    </div>

    <!-- Metadata Grid -->
    <table>
        <tr>
            <th>Natural Language Query</th>
            <td colspan="3" style="font-weight: 500;">"{query}"</td>
        </tr>
        <tr>
            <th>Classified Task</th>
            <td><span class="badge">{task}</span></td>
            <th>Confidence Score</th>
            <td style="font-weight: 600; color: #1e3a8a;">{(confidence * 100):.1f}%</td>
        </tr>
        <tr>
            <th>Specialist Model</th>
            <td style="font-family: monospace;">{model}</td>
            <th>Geographic Bounds</th>
            <td style="font-family: monospace; font-size: 11px;">{bounds_str}</td>
        </tr>
    </table>

    <!-- Structured Observations -->
    {f'''
    <h3 style="margin-top: 24px; margin-bottom: 8px; font-size: 15px; color: #1e3a8a;">Structured Observations</h3>
    <table>
        <thead>
            <tr>
                <th>Domain Category</th>
                <th>Extracted Evidence</th>
            </tr>
        </thead>
        <tbody>
            {obs_rows}
        </tbody>
    </table>
    ''' if obs_rows else ''}

    <!-- Auditable Execution Trace -->
    <h3 style="margin-top: 24px; margin-bottom: 8px; font-size: 15px; color: #1e3a8a;">Auditable Execution Trace (PS Evaluation Metric)</h3>
    <div class="trace-box">
        {trace_items}
    </div>

    <div style="margin-top: 36px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center;">
        SatQuery AI &bull; Team Lunar Circle &bull; SIH 2026 Space Technology Theme &bull; Open-source agentic pipeline
    </div>
</body>
</html>
"""
