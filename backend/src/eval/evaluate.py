#!/usr/bin/env python3
"""Benchmark evaluation on the prescribed public test splits.

Metrics per PS evaluation protocol (normalised before combining):
  - VQA / change-VQA (RSVQA, VRSBench-VQA, CDVQA): answer accuracy
  - Captioning (VRSBench-caption): BLEU-4 + CIDEr
  - Grounding (VRSBench-refdet): IoU@0.5 / mean IoU

Usage:
    python src/eval/evaluate.py --benchmark rsvqa --pred preds.jsonl --ref refs.jsonl
"""
from __future__ import annotations
import argparse, json
from pathlib import Path


def _load(path: Path) -> dict[str, dict]:
    return {r["id"]: r for r in map(json.loads, path.read_text().splitlines()) if r}


def accuracy(pred: dict, ref: dict) -> float:
    hit = sum(1 for k, r in ref.items()
              if str(pred.get(k, {}).get("answer", "")).strip().lower()
              == str(r["answer"]).strip().lower())
    return hit / max(1, len(ref))


def iou(a: list[float], b: list[float]) -> float:
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    ua = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter / ua if ua else 0.0


def grounding(pred: dict, ref: dict, thresh: float = 0.5) -> dict:
    ious = [iou(pred.get(k, {}).get("box", [0,0,0,0]), r["box"]) for k, r in ref.items()]
    return {"mIoU": sum(ious)/max(1,len(ious)),
            f"IoU@{thresh}": sum(i >= thresh for i in ious)/max(1,len(ious))}


def captioning(pred: dict, ref: dict) -> dict:
    try:
        from pycocoevalcap.bleu.bleu import Bleu
        from pycocoevalcap.cider.cider import Cider
    except ImportError:
        raise SystemExit("pip install pycocoevalcap for captioning metrics")
    gts = {k: [r["caption"]] for k, r in ref.items()}
    res = {k: [pred.get(k, {}).get("caption", "")] for k in ref}
    bleu, _ = Bleu(4).compute_score(gts, res)
    cider, _ = Cider().compute_score(gts, res)
    return {"BLEU-4": bleu[3], "CIDEr": cider}


METRICS = {"rsvqa": accuracy, "cdvqa": accuracy, "vrsbench-vqa": accuracy,
           "vrsbench-caption": captioning, "vrsbench-refdet": grounding}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--benchmark", choices=sorted(METRICS), required=True)
    ap.add_argument("--pred", type=Path, required=True)
    ap.add_argument("--ref", type=Path, required=True)
    a = ap.parse_args()
    out = METRICS[a.benchmark](_load(a.pred), _load(a.ref))
    print(json.dumps({"benchmark": a.benchmark,
                      "scores": out if isinstance(out, dict) else {"accuracy": out}}, indent=2))


if __name__ == "__main__":
    main()
