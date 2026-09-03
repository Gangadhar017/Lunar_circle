"""FastAPI backend — the /analyze contract the demo frontend targets.

Run:  uvicorn src.api.main:app --reload
Swap the demo's simulate() for POSTs to /analyze and the GUI goes live.
"""
from __future__ import annotations
import shutil, tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
import json

from src.satquery import controller
from src.satquery.models.base import NotTrainedYet
from src.satquery.report_generator import generate_html_report

app = FastAPI(title="SatQuery AI", version="0.2.0",
              description="Agentic vision-language assistant for multimodal remote sensing (PS 26167)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/", include_in_schema=False)
def frontend():
    """Serve the root API metadata."""
    return JSONResponse({
        "service": "SatQuery AI", 
        "docs": "/docs", 
        "health": "/health",
        "presets": "/presets",
        "frontend": "Please access the React frontend at https://gangadhar017.github.io/Lunar_circle/"
    })


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/presets")
def get_presets() -> dict:
    """Returns the 4 curated judge benchmark demonstration presets for ISRO / SAC PS 26167."""
    return {
        "presets": [
            {
                "id": "urban_change",
                "title": "Bi-Temporal Urban Expansion",
                "subtitle": "Change-VQA & Mask Extraction",
                "query": "Detect changes between these two dates and estimate newly developed regions",
                "task": "change",
                "lat": 38.0413,
                "lng": -97.9189,
                "zoom": 14,
                "images": ["before.jpg", "after.jpg"]
            },
            {
                "id": "sar_optical_fusion",
                "title": "Flood Assessment (Optical + SAR)",
                "subtitle": "Cloud-Penetrating Structural Fusion",
                "query": "Use the optical and SAR images together to identify built-up and water-covered regions",
                "task": "fusion",
                "lat": 23.0225,
                "lng": 72.5714,
                "zoom": 13,
                "images": ["optical.jpg", "sar.jpg"]
            },
            {
                "id": "water_grounding",
                "title": "Water Resource Grounding",
                "subtitle": "Single-Image Referring Expression Grounding",
                "query": "Highlight the major water body and reservoir boundaries referred to in the query",
                "task": "ground",
                "lat": 23.0526,
                "lng": 72.5208,
                "zoom": 13,
                "images": ["optical.jpg"]
            },
            {
                "id": "scene_vqa",
                "title": "Land-Cover Description & VQA",
                "subtitle": "Multispectral Scene Understanding",
                "query": "Describe the land-cover distribution and major infrastructure visible in this scene",
                "task": "caption",
                "lat": 23.0179,
                "lng": 72.5389,
                "zoom": 13,
                "images": ["optical.jpg"]
            }
        ]
    }


@app.post("/report", response_class=HTMLResponse)
async def create_report(payload: dict) -> HTMLResponse:
    """Generates an ISRO / SAC PS 26167 compliant printable Mission Intelligence Briefing."""
    html = generate_html_report(payload)
    return HTMLResponse(content=html)


@app.post("/analyze")
async def analyze(query: str = Form(...),
                  images: list[UploadFile] = File(...),
                  benchmark_mode: bool = Form(False),
                  demo_mode: bool = Form(False),
                  aoi: str = Form(None)) -> dict:
    
    aoi_data = None
    if aoi:
        try:
            parsed = json.loads(aoi)
            if "geometry" not in parsed or "type" not in parsed["geometry"] or parsed["geometry"]["type"] != "Polygon":
                raise ValueError("AOI geometry must be a GeoJSON Polygon")
            if "bounds" not in parsed or not all(k in parsed["bounds"] for k in ("north", "south", "east", "west")):
                raise ValueError("AOI must contain valid bounds")
            aoi_data = parsed
        except Exception as e:
            return {"ok": False, "answer": f"Invalid Investigation Area: {str(e)}", "execution_summary": {"error": "invalid_aoi"}}
            
    workdir = Path(tempfile.mkdtemp(prefix="satquery_"))
    paths = []
    for up in images:
        dest = workdir / up.filename
        with dest.open("wb") as f:
            shutil.copyfileobj(up.file, f)
        paths.append(str(dest))
    try:
        ex = controller.run(query, paths, benchmark_mode=benchmark_mode, demo_mode=demo_mode, aoi=aoi_data)
        summary = ex.get_execution_summary()
        if demo_mode:
            summary["mode"] = "demo"
        return {"ok": ex.ok, "answer": ex.answer, "confidence": ex.confidence,
                "summary": ex.summary, "observations": ex.observations, "demo_metadata": ex.demo_metadata,
                "evidence": ex.evidence, "execution_summary": summary}
    except NotTrainedYet as e:
        return {"ok": False, "answer": str(e),
                "execution_summary": {"error": "weights_not_attached"}}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=port, reload=False)
