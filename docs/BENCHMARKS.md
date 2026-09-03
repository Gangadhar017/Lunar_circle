# SatQuery AI &mdash; Evaluation Benchmarks & Protocols

This document outlines the evaluation methodology and metrics required for **ISRO / SAC Problem Statement 26167**.

---

## Benchmark Datasets

### 1. RSVQA (Remote Sensing Visual Question Answering)
- **Target Task:** Single-image optical VQA.
- **Dataset Variants:** High Resolution (HR) & Low Resolution (LR).
- **Metric:** Exact match answer accuracy across question categories (presence, count, area, comparison).

### 2. CDVQA (Change Detection Visual Question Answering)
- **Target Task:** Bi-temporal change description and reasoning.
- **Modality:** Bi-temporal pairs of identical spatial footprints acquired at distinct timestamps ($T_1, T_2$).
- **Metric:** Multitemporal question-answering accuracy.

### 3. VRSBench (Vision-Language Remote Sensing Benchmark)
- **Target Tasks:**
  - Referring Expression Grounding (`refdet`): Evaluated using Mean IoU and IoU@0.5.
  - Image Captioning: Evaluated using BLEU-4 and CIDEr metrics.

### 4. ISRO / SAC Hidden Evaluation Set
- **Imagery:** Pre-georeferenced Cartosat-2S (Optical) and RISAT (SAR) image pairs.
- **Assessment Focus:** Cross-modal joint information extraction (cloud penetration, structural backscatter, spectral delineation).
