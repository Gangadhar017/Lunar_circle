"""Agentic controller for SatQuery AI.

Interprets the query, validates inputs, selects specialist models from the
registry, executes the workflow, and returns an evidence-grounded response
with an auditable execution trace (the PS-required observable behaviour).
"""
from __future__ import annotations
import re, time
from dataclasses import dataclass, field
from typing import Any

from .registry import REGISTRY
from .validator import validate

# Ordered rules: first match wins. A small classifier LM can replace this
# without changing the interface — the trace records whichever ran.
_RULES: list[tuple[str, str]] = [
    (r"chang|differ|increas|decreas|between .*dates?|grew|new build", "change"),
    (r"\bboth\b|together|fusion|optical and sar|sar and optical|combine|confirm", "fusion"),
    (r"highlight|locate|where is|point|ground|mark|show the", "ground"),
    (r"describe|caption|summar|overview|scene", "caption"),
]


def classify(query: str, num_images: int) -> str:
    q = query.lower()
    
    if num_images == 1:
        if re.search(r"highlight|locate|where|ground", q):
            return "ground"
        if re.search(r"describe|caption|scene", q):
            return "caption"
        return "vqa"
    elif num_images == 2:
        if re.search(r"sar|optical|multimodal|fusion", q):
            return "fusion"
        return "change"
    
    # Fallback to existing logic if unexpected image count
    for pattern, task in _RULES:
        if re.search(pattern, q):
            return task
    return "vqa"


@dataclass
class Execution:
    query: str
    task: str
    ok: bool = False
    answer: str = ""
    summary: str = ""
    observations: dict[str, Any] = field(default_factory=dict)
    evidence: dict[str, Any] = field(default_factory=dict)   # masks/boxes/paths
    demo_metadata: dict[str, Any] = field(default_factory=dict)
    confidence: float = 0.0
    model: str = ""
    params: dict[str, Any] = field(default_factory=dict)
    trace: list[str] = field(default_factory=list)

    def log(self, msg: str) -> None:
        self.trace.append(f"[{time.strftime('%H:%M:%S')}] {msg}")

    def get_execution_summary(self) -> dict:
        """Auditable execution summary: task, model, params, trace — as evaluated."""
        return {"task": self.task, "model": self.model, "params": self.params,
                "confidence": self.confidence, "trace": self.trace}


def run(query: str, image_paths: list[str], benchmark_mode: bool = False, demo_mode: bool = False, aoi: dict = None) -> Execution:
    ex = Execution(query=query, task=classify(query, len(image_paths)))
    ex.log(f'query received: "{query[:80]}"')
    ex.log(f"task classified -> {ex.task}")

    report = validate(ex.task, image_paths, benchmark_mode=benchmark_mode)
    for name, passed, detail in report.checks:
        ex.log(f"validator {'PASS' if passed else 'FAIL'} · {name}" + (f" · {detail}" if detail else ""))
    if not report.ok:
        ex.answer = ("Input configuration incompatible with the requested task — "
                     "no model was executed. See the validation trace for what is missing.")
        return ex

    spec = REGISTRY[ex.task]
    ex.model, ex.params = spec.name, dict(spec.default_params)
    if demo_mode:
        ex.params["demo_mode"] = True
    if aoi:
        ex.params["aoi"] = aoi

    ex.log(f"selected {spec.name} · params {ex.params}")

    t0 = time.time()
    result = spec.load()(query=query, images=report.images, params=ex.params)
    ex.log(f"inference complete · {time.time() - t0:.2f}s")

    ex.answer, ex.evidence, ex.confidence = result.answer, result.evidence, result.confidence
    ex.summary = getattr(result, "summary", "")
    ex.observations = getattr(result, "observations", {})
    ex.demo_metadata = getattr(result, "demo_metadata", {})
    ex.ok = True
    ex.log(f"outputs integrated · confidence {ex.confidence:.2f}")
    return ex
