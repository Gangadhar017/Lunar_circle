"""Band mappings and spectral resolution specifications for remote sensing sensors.

Supports Sentinel-2 (MSI), Sentinel-1 (C-SAR), Cartosat-2S, and RISAT-1A.
"""
from __future__ import annotations
from typing import Any

SENSOR_PROFILES: dict[str, dict[str, Any]] = {
    "sentinel-2": {
        "agency": "ESA",
        "modality": "optical_multispectral",
        "bands": {
            "B02": {"name": "Blue", "wavelength_nm": 490, "resolution_m": 10},
            "B03": {"name": "Green", "wavelength_nm": 560, "resolution_m": 10},
            "B04": {"name": "Red", "wavelength_nm": 665, "resolution_m": 10},
            "B08": {"name": "NIR", "wavelength_nm": 842, "resolution_m": 10},
            "B11": {"name": "SWIR-1", "wavelength_nm": 1610, "resolution_m": 20},
            "B12": {"name": "SWIR-2", "wavelength_nm": 2190, "resolution_m": 20}
        }
    },
    "sentinel-1": {
        "agency": "ESA",
        "modality": "c_band_sar",
        "polarizations": ["VV", "VH"],
        "resolution_m": 10,
        "features": ["surface_roughness", "double_bounce_urban", "water_absorption"]
    },
    "cartosat-2s": {
        "agency": "ISRO",
        "modality": "panchromatic_multispectral",
        "resolution_m": 0.65,
        "features": ["very_high_resolution", "urban_infrastructure", "tactical_recon"]
    },
    "risat-1a": {
        "agency": "ISRO",
        "modality": "c_band_sar",
        "resolution_m": 1.0,
        "features": ["all_weather", "cloud_penetration", "flood_inundation"]
    }
}
