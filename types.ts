
export interface AnalysisStep {
  id: 'start' | 'data' | 'features' | 'model' | 'prediction';
  title: string;
  description: string;
}

export type Layer = 'Satellite' | 'Elevation' | 'Deposits' | 'NDVI' | 'Iron Oxide' | 'Clay' | 'Slope' | 'Gold Potential';

export interface GoldDepositPoint {
  id: number;
  name: string;
  coords: { lat: number; lng: number; };
  description: string;
}

export interface AnalysisResult {
  summary: string;
}