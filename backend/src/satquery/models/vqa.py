"""rsvqa-lora-v2 — single-image remote-sensing VQA specialist.

Backbone: Qwen2.5-VL-7B-Instruct with LoRA adapters fine-tuned on the
BigEarthNet.txt VQA annotation set (see src/train/finetune_lora.py).
Evaluated on RSVQA + VRSBench prescribed test splits.
"""
from __future__ import annotations
from .base import Specialist, NotTrainedYet


class RSVQAModel(Specialist):
    weights_path = "checkpoints/rsvqa-lora-v2"  # produced by finetune_lora.py

    def _infer(self, query, images, params):
        # Real path: load processor + PEFT model, tile the GeoTIFF into
        # `params['tiles']` crops, batch through the VLM, majority-vote answers.
        raise NotTrainedYet(
            "rsvqa-lora-v2 weights not attached. Run src/train/finetune_lora.py "
            "on data/bigearthnet_txt, then set weights_path. The interactive demo "
            "(demo/SatQuery_AI_Demo.html) shows the intended behaviour."
        )
