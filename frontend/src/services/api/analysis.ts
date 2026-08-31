import { post } from './client';
import type { AnalysisRequest, AnalysisResponse } from '../../types';

export async function analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('query', req.query);
  
  if (req.benchmarkMode) {
    formData.append('benchmark_mode', 'true');
  }
  
  if (req.demoMode) {
    formData.append('demo_mode', 'true');
  }

  if (req.aoi) {
    formData.append('aoi', JSON.stringify(req.aoi));
  }
  
  for (const file of req.images) {
    formData.append('images', file);
  }
  
  return post<AnalysisResponse>('/analyze', formData);
}
