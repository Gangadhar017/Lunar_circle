"""Specialist model registry.

Each entry declares a name, its permitted parameters, and a lazy loader that
returns a callable ``(query, images, params) -> ModelResult``. The controller
may only set parameters listed in ``default_params`` — matching the PS rule
that the agent configures *permitted* task parameters only.

The four specialists ship as honest stubs with the full pre/post-processing
interface in place; ``load()`` is where fine-tuned weights get attached
(see src/train/finetune_lora.py).
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Callable

from .models.vqa import RSVQAModel
from .models.caption_ground import CaptionGroundModel
from .models.change import ChangeVQAModel
from .models.fusion import OpticalSARFusionModel


@dataclass
class ModelResult:
    answer: str
    confidence: float
    summary: str = ""
    observations: dict[str, Any] = field(default_factory=dict)
    evidence: dict[str, Any] = field(default_factory=dict)
    demo_metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class ModelSpec:
    name: str
    description: str
    default_params: dict[str, Any]
    _factory: Callable[[], Any]
    _instance: Any = None

    def load(self):
        if self._instance is None:
            self._instance = self._factory()
        return self._instance


REGISTRY: dict[str, ModelSpec] = {
    "vqa": ModelSpec(
        name="rsvqa-lora-v2",
        description="Single-image VQA · Qwen2.5-VL-7B + LoRA fine-tuned on BigEarthNet.txt VQA pairs",
        default_params={"temperature": 0.2, "max_new_tokens": 256, "tiles": 4},
        _factory=RSVQAModel,
    ),
    "caption": ModelSpec(
        name="geocap-ground-v1",
        description="Captioning head trained on BigEarthNet.txt geographically anchored captions",
        default_params={"temperature": 0.3, "max_new_tokens": 192},
        _factory=CaptionGroundModel,
    ),
    "ground": ModelSpec(
        name="geocap-ground-v1",
        description="Referring-expression grounding head (BigEarthNet.txt refdet instructions)",
        default_params={"iou_nms": 0.5, "box_conf": 0.35},
        _factory=CaptionGroundModel,
    ),
    "change": ModelSpec(
        name="changeformer-cdvqa",
        description="Bi-temporal change description / change-VQA, evaluated on CDVQA",
        default_params={"tile": 256, "change_thresh": 0.35},
        _factory=ChangeVQAModel,
    ),
    "fusion": ModelSpec(
        name="sarfusion-net-v1",
        description="Optical–SAR joint information extraction (late fusion)",
        default_params={"optical_bands": ["B2", "B3", "B4"], "sar_pol": "VV", "fuse": "late"},
        _factory=OpticalSARFusionModel,
    ),
}
