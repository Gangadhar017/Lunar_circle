# Deploying SatQuery AI

Two pieces, two free hosts. The frontend is a static single file; the backend is a
Dockerised FastAPI app that also serves the frontend itself — so once the backend is
live you have everything at one URL.

## 1 · Frontend — GitHub Pages (already wired)

`index.html` at the repo root is the mission-console demo. With Pages enabled on
`main` (root folder), the app is live at:

**https://gangadhar017.github.io/Lunar_circle/**

To enable/verify manually: repo → **Settings → Pages** → Source: *Deploy from a branch* →
Branch `main` / `/ (root)` → Save. Every push to `main` redeploys automatically.

## 2 · Backend — Render free tier (recommended)

The repo contains a `Dockerfile` and `render.yaml` blueprint, so this is click-through:

1. Sign up at https://render.com with your GitHub account (no card needed for free tier)
2. **New → Web Service** → connect `Gangadhar017/Lunar_circle`
3. Render detects the Dockerfile; pick the **Free** instance and Create
4. First build takes ~3–5 min. Your service comes up at `https://satquery-ai-XXXX.onrender.com`

What you get at that URL:
- `/` — the mission-console frontend, served by the API itself
- `/docs` — interactive Swagger UI for the agentic backend (great to show judges)
- `/health` — health check (Render pings this)
- `POST /analyze` — the live agentic pipeline: task classification, input validation and
  the auditable execution trace run for real; specialist inference returns a clean
  `weights_not_attached` message until LoRA checkpoints from `src/train/` are mounted

Free-tier notes: the instance sleeps after 15 min idle (first request takes ~30 s to wake —
open it before your demo slot) and has 512 MB RAM, which is why the image installs
`requirements-api.txt` only. Attach trained weights later on a paid/GPU host or expose your
college GPU box via a tunnel.

## Alternative — Hugging Face Spaces (Docker)

1. https://huggingface.co/new-space → SDK: **Docker** → create
2. Push this repo to the Space (`git remote add hf https://huggingface.co/spaces/<you>/satquery-ai && git push hf main`)
3. Spaces injects `PORT`; the Dockerfile already honours it

## Local / college server

```bash
docker build -t satquery-ai .
docker run -p 8000:8000 satquery-ai
# or without Docker:
pip install -r requirements-api.txt
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

Open http://localhost:8000 — frontend, docs and API all in one process.

## Demo-day checklist

- [ ] Open the Render URL 2 minutes early (wake the free instance)
- [ ] Show `/` (product), then `/docs` → POST `/analyze` with a `.tif` (live validator + trace)
- [ ] GitHub Pages URL as backup if the venue network blocks Render
- [ ] Phone hotspot as backup for the venue network itself
