"""changeformer-cdvqa — bi-temporal change understanding specialist.

Siamese encoder over the co-registered pair; change features condition the
language head for change description and change-VQA. Evaluated on CDVQA.
A spatial change map is emitted where reference masks make it meaningful.
"""
from __future__ import annotations
from .base import Specialist, NotTrainedYet


class ChangeVQAModel(Specialist):
    weights_path = "checkpoints/changeformer-cdvqa"

    def _infer(self, query, images, params):
        # Real path: tile both dates at params['tile'], siamese-encode, diff,
        # threshold at params['change_thresh'] for the change map, then decode
        # the answer conditioned on change tokens.
        raise NotTrainedYet("changeformer-cdvqa weights not attached — see src/train/.")
