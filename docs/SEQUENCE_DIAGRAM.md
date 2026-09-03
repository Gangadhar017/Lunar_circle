# SatQuery AI &mdash; System Sequence Diagram

This document details the end-to-end request-response sequence across the user interface, agentic controller, input validator, specialist registry, and output integrator.

```mermaid
sequenceDiagram
    autonumber
    actor User as Analyst / Judge
    participant UI as React Mission Console
    participant Gateway as FastAPI Gateway (/analyze)
    participant Agent as Agentic Controller
    participant Val as Input Validator (GDAL/Rasterio)
    participant Reg as Specialist Registry
    participant Engine as Raster & Specialist Models
    participant Integrator as Output Integrator

    User->>UI: Submit Natural Language Query + Satellite Imagery
    UI->>Gateway: POST /analyze (multipart/form-data)
    Gateway->>Agent: Route query and temporal/multimodal files
    Agent->>Agent: Classify task (VQA, Caption, Ground, Change, Fusion)
    Agent->>Val: Validate CRS, modality, sensor bands, footprint overlap
    alt Validation Fails
        Val-->>Agent: Validation report (Errors detected)
        Agent-->>Gateway: Incompatible input response + Audit trace
        Gateway-->>UI: Display validation warning & guidance
    else Validation Passes
        Val-->>Agent: Validation PASS (Image metadata attached)
        Agent->>Reg: Query specialist model specification & permitted params
        Reg-->>Agent: Model spec loaded (Checkpoints or Raster Engine)
        Agent->>Engine: Execute inference (Spectral diffing / VLM reasoning)
        Engine-->>Agent: Raw findings, bounding boxes, change masks
        Agent->>Integrator: Fuse textual answer, confidence score, and GeoJSON
        Integrator-->>Gateway: Standard AnalysisResponse + Auditable trace
        Gateway-->>UI: Return JSON payload
        UI->>User: Render map overlays, result card, and swipe comparison
    end
```
