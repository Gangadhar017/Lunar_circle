#!/usr/bin/env python3
"""LoRA fine-tuning of the VLM backbone on BigEarthNet.txt.

Adapts Qwen2.5-VL-7B-Instruct to remote sensing using the three BigEarthNet.txt
annotation streams (captions / VQA / referring-expression detection), producing
one adapter per specialist. Runs on a single T4/A10 via 4-bit quantisation +
LoRA (<1% trainable parameters).

Example:
    python src/train/finetune_lora.py --task vqa \
        --data data/bigearthnet_txt --out checkpoints/rsvqa-lora-v2
"""
from __future__ import annotations
import argparse, json
from pathlib import Path

BASE_MODEL = "Qwen/Qwen2.5-VL-7B-Instruct"
TASK_FILES = {"vqa": "vqa.jsonl", "caption": "captions.jsonl", "ground": "refdet.jsonl"}


def load_annotations(data_dir: Path, task: str, split: str = "train") -> list[dict]:
    """BigEarthNet.txt JSONL rows -> chat-format training samples."""
    path = data_dir / "annotations" / TASK_FILES[task]
    ids = set((data_dir / "splits" / f"{split}.txt").read_text().split())
    samples = []
    with path.open() as f:
        for line in f:
            row = json.loads(line)
            if row.get("patch_id") not in ids:
                continue
            samples.append({
                "image": str(data_dir / "images" / row["image"]),
                "messages": [
                    {"role": "user", "content": row.get("question") or row.get("instruction")
                        or "Describe this remote sensing scene."},
                    {"role": "assistant", "content": row.get("answer") or row.get("caption")
                        or json.dumps(row.get("boxes", []))},
                ],
            })
    return samples


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--task", choices=sorted(TASK_FILES), required=True)
    ap.add_argument("--data", type=Path, default=Path("data/bigearthnet_txt"))
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--epochs", type=int, default=1)
    ap.add_argument("--lr", type=float, default=1e-4)
    ap.add_argument("--batch", type=int, default=1)
    ap.add_argument("--grad-accum", type=int, default=16)
    ap.add_argument("--lora-r", type=int, default=16)
    args = ap.parse_args()

    import torch
    from transformers import (AutoProcessor, AutoModelForVision2Seq,
                              BitsAndBytesConfig, TrainingArguments, Trainer)
    from peft import LoraConfig, get_peft_model

    quant = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.bfloat16,
                               bnb_4bit_quant_type="nf4")
    processor = AutoProcessor.from_pretrained(BASE_MODEL)
    model = AutoModelForVision2Seq.from_pretrained(BASE_MODEL, quantization_config=quant,
                                                   device_map="auto")
    lora = LoraConfig(r=args.lora_r, lora_alpha=2 * args.lora_r, lora_dropout=0.05,
                      target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
                      task_type="CAUSAL_LM")
    model = get_peft_model(model, lora)
    model.print_trainable_parameters()

    samples = load_annotations(args.data, args.task)
    print(f"{len(samples)} training samples for task '{args.task}'")

    def collate(batch):
        from PIL import Image
        texts, images = [], []
        for s in batch:
            texts.append(processor.apply_chat_template(s["messages"], tokenize=False,
                                                       add_generation_prompt=False))
            images.append(Image.open(s["image"]).convert("RGB"))
        enc = processor(text=texts, images=images, return_tensors="pt", padding=True)
        enc["labels"] = enc["input_ids"].clone()
        return enc

    trainer = Trainer(
        model=model,
        train_dataset=samples,
        data_collator=collate,
        args=TrainingArguments(
            output_dir=str(args.out), num_train_epochs=args.epochs,
            per_device_train_batch_size=args.batch, gradient_accumulation_steps=args.grad_accum,
            learning_rate=args.lr, bf16=True, logging_steps=20, save_strategy="epoch",
            report_to="none",
        ),
    )
    trainer.train()
    model.save_pretrained(args.out)
    processor.save_pretrained(args.out)
    print(f"adapter saved -> {args.out} · point the matching Specialist.weights_path here")


if __name__ == "__main__":
    main()
