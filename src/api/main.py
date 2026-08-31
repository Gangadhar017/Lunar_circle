"""FastAPI backend — the /analyze contract the demo frontend targets.

Run:  uvicorn src.api.main:app --reload
Swap the demo's simulate() for POSTs to /analyze and the GUI goes live.
"""
from __future__ import annotations
import shutil, tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from src.satquery import controller
from src.satquery.models.base import NotTrainedYet

app = FastAPI(title="SatQuery AI", version="0.1.0",
              description="Agentic vision-language assistant for multimodal remote sensing (PS 26167)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(query: str = Form(...),
                  images: list[UploadFile] = File(...),
                  benchmark_mode: bool = Form(False)) -> dict:
    workdir = Path(tempfile.mkdtemp(prefix="satquery_"))
    paths = []
    for up in images:
        dest = workdir / up.filename
        with dest.open("wb") as f:
            shutil.copyfileobj(up.file, f)
        paths.append(str(dest))
    try:
        ex = controller.run(query, paths, benchmark_mode=benchmark_mode)
        return {"ok": ex.ok, "answer": ex.answer, "confidence": ex.confidence,
                "evidence": ex.evidence, "execution_summary": ex.summary()}
    except NotTrainedYet as e:
        return {"ok": False, "answer": str(e),
                "execution_summary": {"error": "weights_not_attached"}}
