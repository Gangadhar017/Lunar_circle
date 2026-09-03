#!/usr/bin/env python3
"""Generates synthetic GeoTIFF samples with WGS84 spatial metadata for testing."""
from pathlib import Path
import numpy as np

try:
    import rasterio
    from rasterio.transform import from_bounds
    HAS_RASTERIO = True
except ImportError:
    HAS_RASTERIO = False


def create_synthetic_geotiff(output_path: Path, width: int = 128, height: int = 128):
    if not HAS_RASTERIO:
        print("[Notice] rasterio not installed; skipping binary GeoTIFF creation.")
        return

    output_path.parent.mkdir(parents=True, exist_ok=True)
    # 3 bands: RGB simulation
    bands_data = np.random.randint(0, 255, (3, height, width), dtype=np.uint8)
    transform = from_bounds(-97.93, 38.03, -97.90, 38.05, width, height)

    with rasterio.open(
        output_path,
        'w',
        driver='GTiff',
        height=height,
        width=width,
        count=3,
        dtype=bands_data.dtype,
        crs='EPSG:4326',
        transform=transform,
    ) as dst:
        dst.write(bands_data)

    print(f"Created synthetic GeoTIFF: {output_path}")


if __name__ == "__main__":
    create_synthetic_geotiff(Path("data/sample_optical.tif"))
