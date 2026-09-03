/**
 * Geospatial, GeoJSON, and satellite sensor type definitions for SatQuery AI.
 */

export type Coordinate = [number, number]; // [lng, lat]

export interface GeoJSONPolygonGeometry {
  type: 'Polygon';
  coordinates: Coordinate[][];
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: GeoJSONPolygonGeometry;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface SatelliteMetadata {
  sensor: 'Sentinel-1' | 'Sentinel-2' | 'Cartosat-2S' | 'RISAT-1A' | 'Unknown';
  modality: 'optical' | 'sar' | 'multispectral';
  acquisitionDate?: string;
  crs: string; // e.g. "EPSG:4326" or "EPSG:32632"
  gsdMeters: number; // Ground Sampling Distance
  bands: string[];
}
