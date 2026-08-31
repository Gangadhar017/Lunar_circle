# Datasets

All datasets prescribed by PS 26167 are open source. This folder holds them after download
(`scripts/download_datasets.py` prepares the layout). Nothing under `data/` is committed to git.

## Primary fine-tuning dataset

### BigEarthNet.txt — multi-sensor image–text dataset
- **Paper:** [arXiv:2603.29630](https://arxiv.org/abs/2603.29630) · **Site:** https://txt.bigearth.net · License CC-BY-4.0
- **Scale:** 464,044 co-registered **Sentinel-1 SAR + Sentinel-2 multispectral** image pairs with **9.6M text annotations**
- **Annotation types** (each maps to one of our specialist models):
  1. Geographically anchored **captions** — LULC classes, spatial relations, environmental context → `geocap-ground`
  2. **VQA pairs** across multiple task types → `rsvqa-lora`
  3. **Referring-expression detection** instructions with bounding boxes → grounding head
- **Why it's our adaptation backbone:** the S1+S2 co-registration is exactly the optical–SAR pairing the
  ISRO/SAC hidden set (Cartosat-2S + RISAT) will test, and it ships a manually verified benchmark split.

Expected layout after download:
```
data/bigearthnet_txt/
├── images/           # S1 + S2 patches
├── annotations/      # captions.jsonl · vqa.jsonl · refdet.jsonl
└── splits/           # train / val / benchmark (manually verified)
```

## Public evaluation benchmarks

| Benchmark | Evaluates | Where |
|---|---|---|
| **VRSBench** | Single-image captioning, grounding, VQA | https://github.com/lx709/VRSBench (HF: `xiang709/VRSBench`) |
| **RSVQA** | Remote-sensing VQA (LR/HR) | https://rsvqa.sylvainlobry.com |
| **CDVQA** | Multitemporal change-based VQA | https://github.com/YZHJessica/CDVQA |

Only the **prescribed test splits** are used for reporting; scores are normalised before combination,
matching the PS evaluation protocol. Benchmark PNG/JPEG inputs are accepted by the validator solely
for these datasets — operational inputs must be GeoTIFF/TIFF.

> Mirror URLs occasionally move — `download_datasets.py` prints the canonical source for anything
> it cannot fetch automatically so you can grab it manually.
