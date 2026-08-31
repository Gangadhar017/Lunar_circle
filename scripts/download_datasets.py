#!/usr/bin/env python3
"""Prepare the SatQuery AI dataset layout under data/.

Downloads what can be fetched unattended and prints canonical instructions for
anything that needs a browser or accepts-terms step. Safe to re-run.

Usage:
    python scripts/download_datasets.py [--only bigearthnet|vrsbench|rsvqa|cdvqa]
"""
from __future__ import annotations
import argparse, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "data"

SOURCES = {
    "bigearthnet": {
        "dir": "bigearthnet_txt",
        "note": (
            "BigEarthNet.txt (arXiv:2603.29630) — 464k co-registered S1+S2 pairs, 9.6M annotations.\n"
            "  Canonical source: https://txt.bigearth.net  (captions / VQA / referring-expression sets,\n"
            "  plus the manually verified benchmark split). Download the annotation JSONLs and image\n"
            "  archives there, then extract into data/bigearthnet_txt/{images,annotations,splits}."
        ),
        "hf": None,  # hosted on project site, not a single HF dataset
    },
    "vrsbench": {
        "dir": "vrsbench",
        "note": "VRSBench — https://github.com/lx709/VRSBench",
        "hf": "xiang709/VRSBench",
    },
    "rsvqa": {
        "dir": "rsvqa",
        "note": (
            "RSVQA — register & download at https://rsvqa.sylvainlobry.com (LR and HR sets).\n"
            "  Place under data/rsvqa/{LR,HR}."
        ),
        "hf": None,
    },
    "cdvqa": {
        "dir": "cdvqa",
        "note": "CDVQA — https://github.com/YZHJessica/CDVQA (built on SECOND change-detection imagery).",
        "hf": None,
    },
}


def try_hf_download(repo: str, dest: Path) -> bool:
    try:
        from huggingface_hub import snapshot_download
    except ImportError:
        print("  huggingface_hub not installed — `pip install huggingface_hub` for auto-download.")
        return False
    try:
        snapshot_download(repo_id=repo, repo_type="dataset", local_dir=dest)
        return True
    except Exception as e:  # noqa: BLE001 — surface any hub error to the user
        print(f"  auto-download failed ({e}); use the canonical source below.")
        return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", choices=sorted(SOURCES), help="prepare a single dataset")
    args = ap.parse_args()

    for name, spec in SOURCES.items():
        if args.only and name != args.only:
            continue
        dest = ROOT / spec["dir"]
        dest.mkdir(parents=True, exist_ok=True)
        print(f"\n== {name} -> {dest}")
        done = try_hf_download(spec["hf"], dest) if spec["hf"] else False
        if done:
            print("  downloaded via Hugging Face hub.")
        else:
            print("  " + spec["note"])
    print("\nLayout ready. See data/README.md for the expected structure per dataset.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
