# SatQuery AI &mdash; REST API Specification
**Version:** 0.2.0  
**Contract Definition:** PS 26167 Compliant Geospatial Vision-Language Interface  

---

## Endpoints

### 1. `GET /health`
- **Description:** Health check ping for load balancers and container orchestrators.
- **Response:**
  ```json
  { "status": "ok" }
  ```

### 2. `GET /presets`
- **Description:** Returns pre-configured demonstration benchmark scenarios for ISRO / SAC evaluation.
- **Response:**
  ```json
  {
    "presets": [
      {
        "id": "urban_change",
        "title": "Bi-Temporal Urban Expansion",
        "task": "change",
        "lat": 38.0413,
        "lng": -97.9189,
        "zoom": 14,
        "images": ["before.jpg", "after.jpg"]
      }
    ]
  }
  ```

### 3. `POST /analyze`
- **Description:** Primary agentic pipeline endpoint. Accepts query and multipart imagery.
- **Form Parameters:**
  - `query` (string, required): Natural language instruction.
  - `images` (files, required): 1 image for VQA/grounding; 2 images for bi-temporal/fusion.
  - `demo_mode` (bool, optional): Enable deterministic demonstration inference.
  - `benchmark_mode` (bool, optional): Allow non-GeoTIFF JPEG/PNG benchmark formats.
  - `aoi` (string JSON, optional): GeoJSON polygon representing investigation boundary.
- **Response:**
  ```json
  {
    "ok": true,
    "answer": "Detected new urban infrastructure development.",
    "confidence": 0.89,
    "summary": "Summary text",
    "observations": { "Category": ["Observed items"] },
    "evidence": { "type": "FeatureCollection", "features": [] },
    "execution_summary": {
      "task": "change",
      "model": "changeformer-cdvqa",
      "params": {},
      "trace": ["[12:00:00] task classified -> change"]
    }
  }
  ```

### 4. `POST /report`
- **Description:** Generates a printable, self-contained HTML mission intelligence briefing.
- **Response:** `text/html` (printable).
