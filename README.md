# SatQuery AI

SatQuery AI is an interactive geospatial intelligence platform. It provides a map-first workspace where users can investigate geographic areas and satellite imagery using natural language. The core product principle is: **"The map is the product. Natural language is the control layer."**

## What the Current Demo Does

The current demonstration provides a fully working React-based frontend workspace integrated with a FastAPI backend. It showcases the foundational user experience and architecture:
- Full-viewport interactive map workspace using CARTO satellite basemaps.
- Natural language query surface for issuing investigation commands.
- Capability to attach imagery (e.g., GeoTIFF) for analysis.
- Complete integration with the backend `POST /analyze` endpoint.

*Note: The demo frontend successfully routes the images and queries to the backend, but the backend currently simulates the final AI response (returning a `NotTrainedYet` or simulated payload), as the actual deep learning model weights are not attached in this repository.*

## Repository Structure

The project is organized strictly into backend and frontend domains:

```
Lunar_circle/
├── backend/              # FastAPI Python application
│   ├── src/              # Backend source code
│   └── requirements.txt  # Python dependencies
├── frontend/             # Vite + React + TypeScript application
├── docs/                 # System architecture and design blueprints
├── data/                 # Sample imagery and documentation
├── scripts/              # Project utility scripts
├── Dockerfile            # Container definition for the backend API
└── render.yaml           # Deployment blueprint
```

## How to Run the Application

### 1. Backend (FastAPI)

The backend provides the API contract and model execution endpoints.

```bash
cd backend

# Ensure Python 3.11+ is installed
pip install -r requirements.txt

# Start the API server
uvicorn src.api.main:app --reload
```
The backend will run on `http://127.0.0.1:8000`.

### 2. Frontend (Vite + React)

The frontend provides the interactive geospatial workspace.

```bash
cd frontend

# Install Node dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and insert your VITE_CARTO_API_KEY

# Start the dev server
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Required Environment Variables

The frontend requires access to CARTO's basemaps. You must provide a valid API key in the `frontend/.env` file.

- `VITE_CARTO_API_KEY`: Your CARTO account API key for loading the basemap tiles.

*Note: Do not commit `.env` or `.env.local` to version control.*

## Current Limitations

- **Backend AI Models**: The actual machine learning weights for geospatial inference are not bundled in this repository. Submitting queries will result in a simulated or fallback response (e.g. "System Error" or "NotTrainedYet") to demonstrate the error-handling states of the UI.
- **Frontend State**: The UI is optimized for desktop and tablet viewports. Mobile responsiveness is implemented but may lack advanced map interactions depending on the device.
