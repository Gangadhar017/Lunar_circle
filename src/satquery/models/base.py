"""Shared base for specialist models."""
from __future__ import annotations
from abc import ABC, abstractmethod


class Specialist(ABC):
    """A specialist model callable: (query, images, params) -> ModelResult.

    Subclasses implement ``_infer``. ``__call__`` wraps it so weight loading,
    device placement and error surfaces stay in one place.
    """

    weights_path: str | None = None  # set once fine-tuned checkpoints exist

    def __call__(self, query, images, params):
        return self._infer(query=query, images=images, params=params)

    @abstractmethod
    def _infer(self, query, images, params):
        ...


class NotTrainedYet(RuntimeError):
    """Raised by stubs until fine-tuned weights are attached (see src/train/)."""
