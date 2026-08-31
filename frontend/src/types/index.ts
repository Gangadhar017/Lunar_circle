export interface InvestigationBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface InvestigationCenter {
  lat: number;
  lng: number;
}

export interface InvestigationArea {
  geometry: any; // GeoJSON Polygon
  bounds: InvestigationBounds;
  center: InvestigationCenter;
  source: 'drawn' | 'current_view' | 'auto';
  createdAt: number;
}

export interface AnalysisRequest {
  query: string;
  images: File[];
  benchmarkMode?: boolean;
  demoMode?: boolean;
  aoi?: InvestigationArea;
}

export interface AnalysisResponse {
  ok: boolean;
  answer: string;
  summary?: string;
  observations?: Record<string, string[]>;
  demo_metadata?: Record<string, string>;
  confidence: number;
  evidence: Record<string, any>;
  execution_summary: Record<string, any>;
}
