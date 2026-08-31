"""sarfusion-net-v1 — optical–SAR joint information extraction.

Late fusion of an optical/multispectral branch (params['optical_bands']) and a
SAR amplitude branch (params['sar_pol']); heads for built-up and water
extraction where the modalities are complementary (SAR structure + day/night
capability, optical spectra). Domain target: Cartosat-2S + RISAT pairs.
"""
from __future__ import annotations
from .base import Specialist, NotTrainedYet


class OpticalSARFusionModel(Specialist):
    weights_path = "checkpoints/sarfusion-net-v1"

    def _infer(self, query, images, params):
        raise NotTrainedYet("sarfusion-net-v1 weights not attached — see src/train/.")
