import type { AnalysisStep, GoldDepositPoint, Layer } from './types';

export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'start',
    title: 'Start Analysis',
    description: 'Begin the process of identifying gold potential zones.'
  },
  {
    id: 'data',
    title: 'Data Selection',
    description: 'Choose satellite, elevation, and geological datasets.'
  },
  {
    id: 'features',
    title: 'Feature Engineering',
    description: 'Extract key indicators like mineral indices and slope.'
  },
  {
    id: 'model',
    title: 'Train AI Model',
    description: 'Use a Random Forest model to learn from the data.'
  },
  {
    id: 'prediction',
    title: 'Gold Potential Map',
    description: 'Visualize the final prediction map and analysis results.'
  }
];

export const KNOWN_DEPOSITS: GoldDepositPoint[] = [
    { id: 1, name: "Hassai Mine", coords: { lat: 18.767, lng: 36.864 }, description: "Major gold mine in the Red Sea Hills." },
    { id: 2, name: "Block 14 Project", coords: { lat: 20.25, lng: 33.45 }, description: "Significant gold discovery in the Nubian Shield." },
    { id: 3, name: "Abu Sari", coords: { lat: 19.1, lng: 33.9 }, description: "Artisanal mining area with known deposits." },
    { id: 4, name: "Qubgaba", coords: { lat: 18.8, lng: 34.5 }, description: "Exploration site with promising gold mineralization." },
    { id: 5, name: "Galat Sufar South", coords: { lat: 17.3, lng: 33.8 }, description: "Historic mining district with modern exploration." },
];

export const LAYER_LABELS: Record<Layer, string> = {
  Satellite: "Satellite Imagery",
  Elevation: "Elevation (DEM)",
  Deposits: "Known Gold Deposits",
  NDVI: "NDVI (Vegetation Index)",
  "Iron Oxide": "Iron Oxide Index",
  Clay: "Clay Minerals Index",
  Slope: "Slope Angle",
  "Gold Potential": "Gold Potential Heatmap"
};