export interface PresetItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  query: string;
  lat: number;
  lng: number;
  zoom: number;
  images: string[];
}

export const PRESETS: PresetItem[] = [
  {
    id: 'urban_change',
    title: 'Bi-Temporal Urban Expansion',
    subtitle: 'Change-VQA & Mask Extraction',
    tag: 'Change-VQA (T1/T2)',
    query: 'Detect changes between these two dates and estimate newly developed regions',
    lat: 38.0413,
    lng: -97.9189,
    zoom: 14,
    images: ['before.jpg', 'after.jpg'],
  },
  {
    id: 'sar_optical_fusion',
    title: 'Flood Assessment (Optical + SAR)',
    subtitle: 'Cloud-Penetrating Structural Fusion',
    tag: 'Cross-Modal Fusion',
    query: 'Use the optical and SAR images together to identify built-up and water-covered regions',
    lat: 23.0225,
    lng: 72.5714,
    zoom: 13,
    images: ['optical.jpg', 'sar.jpg'],
  },
  {
    id: 'water_grounding',
    title: 'Water Resource Grounding',
    subtitle: 'Referring Expression Grounding',
    tag: 'Single-Image Grounding',
    query: 'Highlight the major water body and reservoir boundaries referred to in the query',
    lat: 23.0526,
    lng: 72.5208,
    zoom: 13,
    images: ['optical.jpg'],
  },
  {
    id: 'scene_vqa',
    title: 'Land-Cover Description & VQA',
    subtitle: 'Multispectral Scene Understanding',
    tag: 'Baseline RS-VQA',
    query: 'Describe the land-cover distribution and major infrastructure visible in this scene',
    lat: 23.0179,
    lng: 72.5389,
    zoom: 13,
    images: ['optical.jpg'],
  },
];
