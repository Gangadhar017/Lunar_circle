"""Input validation for SatQuery AI.

Implements the PS-mandated compatibility checking: image count, modality,
format, metadata, and co-registration — before any model is selected.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path

try:
    import rasterio
    from rasterio.errors import RasterioIOError
    HAS_RASTERIO = True
except ImportError:  # validator still runs format/count checks without GDAL
    HAS_RASTERIO = False

GEO_FORMATS = {".tif", ".tiff"}
BENCHMARK_FORMATS = {".png", ".jpg", ".jpeg"}  # accepted only for prescribed benchmarks

TASK_INPUT_REQUIREMENTS = {
    "vqa": {"count": 1},
    "caption": {"count": 1},
    "ground": {"count": 1},
    "change": {"count": 2, "pair": "bitemporal"},
    "fusion": {"count": 2, "pair": "cross_modal"},
}


@dataclass
class ImageInfo:
    path: Path
    modality: str = "unknown"      # optical | sar | unknown
    width: int = 0
    height: int = 0
    bands: int = 0
    crs: str | None = None
    bounds: tuple | None = None
    is_benchmark_format: bool = False


@dataclass
class ValidationReport:
    ok: bool
    checks: list[tuple[str, bool, str]] = field(default_factory=list)
    images: list[ImageInfo] = field(default_factory=list)

    def add(self, name: str, passed: bool, detail: str = "") -> None:
        self.checks.append((name, passed, detail))
        if not passed:
            self.ok = False


def _inspect(path: Path, benchmark_mode: bool) -> ImageInfo:
    info = ImageInfo(path=path, is_benchmark_format=path.suffix.lower() in BENCHMARK_FORMATS)
    if info.is_benchmark_format or not HAS_RASTERIO:
        return info
    try:
        with rasterio.open(path) as ds:
            info.width, info.height, info.bands = ds.width, ds.height, ds.count
            info.crs = str(ds.crs) if ds.crs else None
            info.bounds = tuple(ds.bounds)
            # heuristic modality: single-band float amplitude -> SAR; 3+ bands -> optical/MS
            info.modality = "sar" if ds.count == 1 else "optical"
    except RasterioIOError:
        pass
    return info


def validate(task: str, paths: list[str | Path], benchmark_mode: bool = False) -> ValidationReport:
    """Validate an input configuration for a classified task.

    Returns a ValidationReport whose ``checks`` mirror the GUI validator panel.
    """
    report = ValidationReport(ok=True)
    req = TASK_INPUT_REQUIREMENTS.get(task)
    if req is None:
        report.add("task recognised", False, f"unknown task '{task}'")
        return report
    report.add("task recognised", True, task)

    paths = [Path(p) for p in paths]
    report.add(
        "image count matches task family",
        len(paths) == req["count"],
        f"got {len(paths)}, need {req['count']}"
        + (" (bi-temporal pair)" if req.get("pair") == "bitemporal" else "")
        + (" (optical–SAR pair)" if req.get("pair") == "cross_modal" else ""),
    )
    if not report.ok:
        return report

    for p in paths:
        allowed = GEO_FORMATS | (BENCHMARK_FORMATS if benchmark_mode else set())
        report.add(f"format accepted · {p.name}", p.suffix.lower() in allowed,
                   "GeoTIFF/TIFF required outside benchmark mode")
        report.add(f"file exists · {p.name}", p.exists(), str(p))
    if not report.ok:
        return report

    report.images = [_inspect(p, benchmark_mode) for p in paths]

    if req.get("pair") == "cross_modal" and HAS_RASTERIO and not benchmark_mode:
        mods = sorted(i.modality for i in report.images)
        report.add("modalities are optical + SAR", mods == ["optical", "sar"], f"detected {mods}")

    if len(report.images) == 2 and HAS_RASTERIO and not benchmark_mode:
        a, b = report.images
        same_crs = a.crs is not None and a.crs == b.crs
        report.add("CRS aligned", same_crs, f"{a.crs} vs {b.crs}")
        if a.bounds and b.bounds:
            overlap = not (a.bounds[2] <= b.bounds[0] or b.bounds[2] <= a.bounds[0]
                           or a.bounds[3] <= b.bounds[1] or b.bounds[3] <= a.bounds[1])
            report.add("footprints overlap (co-registration)", overlap,
                       "no spatial intersection between the two inputs")
    return report
