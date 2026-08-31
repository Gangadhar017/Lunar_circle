from __future__ import annotations
from typing import Any

import time
import random
from src.satquery.registry import ModelResult
from . import scenarios

class DemoAdapter:
    """Intercepts inference requests and routes them to deterministic demo scenarios."""

    @classmethod
    def run(cls, specialist_name: str, query: str, images: list[Any], params: dict[str, Any]) -> ModelResult:
        """
        Executes a deterministic demo scenario instead of real ML inference.
        Returns a compatible ModelResult.
        """
        aoi = params.get("aoi")

        # The backend now returns instantly. Processing simulation is handled in the frontend UI.
        if specialist_name == "RSVQAModel":
            return scenarios.get_vqa_scenario(query, aoi)
        elif specialist_name == "CaptionGroundModel":
            return scenarios.get_caption_grounding_scenario(query, aoi)
        elif specialist_name == "ChangeVQAModel":
            return scenarios.get_change_scenario(query, aoi)
        elif specialist_name == "OpticalSARFusionModel":
            return scenarios.get_fusion_scenario(query, aoi)
        else:
            return ModelResult(
                answer=f"Demo mode fallback: Processed query '{query}' for model {specialist_name}.",
                confidence=0.99,
                summary="Fallback executed",
                demo_metadata={"scenario": "Fallback", "modality": "Unknown"}
            )
