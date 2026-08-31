FROM python:3.11-slim

WORKDIR /app

# API-only dependencies (rasterio wheels bundle GDAL — no apt packages needed)
COPY requirements-api.txt .
RUN pip install --no-cache-dir -r requirements-api.txt

COPY src/ src/
COPY demo/ demo/

# Render/HF Spaces inject PORT; default 8000 for local runs
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT}"]
