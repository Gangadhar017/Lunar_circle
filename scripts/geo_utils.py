"""Geospatial coordinate conversions and bounding box utility helpers.

Supports WGS84 (EPSG:4326) and UTM transformations, bounding box intersection,
and area calculation for satellite footprints.
"""
from __future__ import annotations
import math


def calculate_footprint_area_km2(south: float, west: float, north: float, east: float) -> float:
    """Calculates approximate geographic bounding box area in square kilometers."""
    R = 6371.0 # Earth radius in km
    lat_mid = math.radians((south + north) / 2.0)
    d_lat = math.radians(north - south)
    d_lon = math.radians(east - west)
    dy = d_lat * R
    dx = d_lon * R * math.cos(lat_mid)
    return abs(dx * dy)


def compute_iou_bounds(box1: dict[str, float], box2: dict[str, float]) -> float:
    """Computes Intersection over Union (IoU) between two bounding boxes with north, south, east, west."""
    inter_south = max(box1["south"], box2["south"])
    inter_west = max(box1["west"], box2["west"])
    inter_north = min(box1["north"], box2["north"])
    inter_east = min(box1["east"], box2["east"])

    if inter_north <= inter_south or inter_east <= inter_west:
        return 0.0

    inter_area = calculate_footprint_area_km2(inter_south, inter_west, inter_north, inter_east)
    area1 = calculate_footprint_area_km2(box1["south"], box1["west"], box1["north"], box1["east"])
    area2 = calculate_footprint_area_km2(box2["south"], box2["west"], box2["north"], box2["east"])

    union_area = area1 + area2 - inter_area
    return inter_area / union_area if union_area > 0 else 0.0
