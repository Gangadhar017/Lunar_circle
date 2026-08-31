"""geocap-ground-v1 — captioning + referring-expression grounding specialist.

Trained on BigEarthNet.txt geographically anchored captions and refdet
instructions (bounding-box supervision). Evaluated on VRSBench.
"""
from __future__ import annotations
from .base import Specialist, NotTrainedYet


class CaptionGroundModel(Specialist):
    weights_path = "checkpoints/geocap-ground-v1"

    def _infer(self, query, images, params):
        # Real path: caption -> generate; ground -> text-conditioned box head,
        # NMS at params['iou_nms'], return boxes in image + geo coordinates.
        raise NotTrainedYet("geocap-ground-v1 weights not attached — see src/train/.")
