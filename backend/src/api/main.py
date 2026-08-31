"""FastAPI backend — the /analyze contract the demo frontend targets.

Run:  uvicorn src.api.main:app --reload
Swap the demo's simulate() for POSTs to /analyze and the GUI goes live.
"""
from __future__ import annotations
import shutil, tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from src.satquery import controller
from src.satquery.models.base import NotTrainedYet
import json

app = FastAPI(title="SatQuery AI", version="0.1.0",
              description="Agentic vision-language assistant for multimodal remote sensing (PS 26167)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/", include_in_schema=False)
def frontend():
    """Serve the root API metadata."""
    return JSONResponse({
        "service": "SatQuery AI", 
        "docs": "/docs", 
        "health": "/health",
        "frontend": "Please access the React frontend at port 5173."
    })


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


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
