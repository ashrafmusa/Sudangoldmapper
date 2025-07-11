import React from 'react';
import type { AnalysisStep, Layer } from '../types';
import { LAYER_LABELS } from '../constants';
import { Legend } from './Legend';
import { Spinner } from './Spinner';
import { SatelliteIcon } from './icons/SatelliteIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ControlPanelProps {
  step: AnalysisStep;
  onNext: () => void;
  onToggleLayer: (layer: Layer) => void;
  onReset: () => void;
  onViewReport: () => void;
  activeLayers: Set<Layer>;
  isProcessing: boolean;
  satelliteUpdateAvailable: boolean;
  satelliteUpdateMessage: string;
  onSatelliteUpdate: () => void;
  isGeneratingFeatures?: boolean;
  generatedFeatures?: Set<Layer>;
  onGenerateFeatures?: () => void;
  trainingProgress?: number;
  trainingStatusText?: string;
  modelExplanation?: string;
  isLoadingExplanation?: boolean;
}

const DATA_LAYER_DESCRIPTIONS: Partial<Record<Layer, string>> = {
  'Satellite': 'High-resolution satellite imagery serves as the base map for our analysis.',
  'Elevation': 'Digital Elevation Model (DEM) data provides terrain information like slope and aspect.',
  'Deposits': 'Locations of known gold deposits, used to train and validate our AI model.',
};

const LayerToggle: React.FC<{ layer: Layer; activeLayers: Set<Layer>; onToggle: (layer: Layer) => void; disabled?: boolean; icon?: React.ReactNode; description?: string }> = ({ layer, activeLayers, onToggle, disabled, icon, description }) => {
    const isChecked = activeLayers.has(layer);
    return (
        <label className={`group relative flex items-center justify-between p-3 rounded-md transition-colors duration-200 ${disabled ? 'cursor-not-allowed opacity-60 bg-gray-700/30' : 'cursor-pointer hover:bg-gray-600/50'} ${isChecked ? 'bg-yellow-500/10' : 'bg-gray-700/50'}`}>
            <div className="flex items-center">
                {icon && <div className="mr-3 text-gray-400 w-5 h-5 flex items-center justify-center">{icon}</div>}
                <span className={`font-medium ${isChecked && !disabled ? 'text-yellow-400' : 'text-gray-300'}`}>{LAYER_LABELS[layer]}</span>
            </div>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(layer)}
                disabled={disabled}
                className="sr-only"
            />
            {!disabled && (
              <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ${isChecked ? 'bg-yellow-500' : 'bg-gray-600'}`}>
                  <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${isChecked ? 'translate-x-4' : ''}`}></div>
              </div>
            )}
            {description && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {description}
                </div>
            )}
        </label>
    );
};

const FEATURE_LAYERS: { layer: Layer; description: string }[] = [
    { layer: 'NDVI', description: 'Measures vegetation health by contrasting near-infrared light (which healthy plants reflect) and red light (which they absorb). In mineral exploration, anomalies in vegetation can indicate stress from underlying soil chemistry, potentially pointing to mineral deposits.' },
    { layer: 'Iron Oxide', description: 'Highlights areas with high concentrations of iron oxides (rust), which often appear as reddish staining on the ground. These are key indicators of hydrothermal alteration—a process where hot, mineral-rich fluids have changed the rock, potentially depositing gold.' },
    { layer: 'Clay', description: 'This index detects specific types of clay minerals that are also formed by hydrothermal alteration. The presence of these clays can signal that the right chemical and thermal conditions existed for gold mineralization, making these zones prime targets for exploration.' },
    { layer: 'Slope', description: 'Analyzes the steepness of the terrain from elevation data. Gold deposits are often found in specific topographic settings. For example, gentler slopes might allow for the accumulation of placer gold, while certain minerals are often exposed along steeper, eroded hillsides.' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  step, 
  onNext, 
  onToggleLayer, 
  activeLayers, 
  isProcessing, 
  onReset,
  onViewReport, 
  satelliteUpdateAvailable, 
  satelliteUpdateMessage, 
  onSatelliteUpdate,
  isGeneratingFeatures,
  generatedFeatures,
  onGenerateFeatures,
  trainingProgress,
  trainingStatusText,
  modelExplanation,
  isLoadingExplanation,
}) => {
  const renderContent = () => {
    switch (step.id) {
      case 'start':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Welcome to Sudan GoldMapper</h2>
            <p className="text-gray-400 mb-6">An AI-powered tool to simulate the discovery of gold potential zones in Sudan. Click below to begin the analysis.</p>
            <button onClick={onNext} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105">
                Start Analysis
            </button>
          </div>
        );
      case 'data':
        return (
          <div>
            <h3 className="text-lg font-bold mb-2 text-yellow-400">1. Data Layers</h3>
            <p className="text-sm text-gray-400 mb-4">Select the foundational datasets. These will be processed in the next step to extract key features for the AI model.</p>
            
            {satelliteUpdateAvailable && (
                 <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-4 text-center animate-fade-in">
                    <p className="text-sm text-blue-200 mb-3">{satelliteUpdateMessage}</p>
                    <button onClick={onSatelliteUpdate} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                        Update Imagery
                    </button>
                 </div>
            )}

            <div className="space-y-2">
                <LayerToggle layer="Satellite" activeLayers={activeLayers} onToggle={onToggleLayer} icon={<SatelliteIcon className="w-5 h-5" />} description={DATA_LAYER_DESCRIPTIONS.Satellite} />
                <LayerToggle layer="Elevation" activeLayers={activeLayers} onToggle={onToggleLayer} description={DATA_LAYER_DESCRIPTIONS.Elevation} />
                <LayerToggle layer="Deposits" activeLayers={activeLayers} onToggle={onToggleLayer} description={DATA_LAYER_DESCRIPTIONS.Deposits} />
            </div>
          </div>
        );
      case 'features':
         const featuresStarted = isGeneratingFeatures || (generatedFeatures && generatedFeatures.size > 0);
         const currentlyGeneratingIndex = generatedFeatures?.size ?? 0;

         return (
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">2. Feature Engineering</h3>
             {!featuresStarted ? (
               <>
                 <div className="text-sm text-gray-400 mb-6 space-y-2">
                    <p>Click below to process the raw data and extract key geospatial features for the AI model:</p>
                    <ul className="list-disc list-inside pl-2 text-gray-500">
                        <li>NDVI (Vegetation)</li>
                        <li>Iron Oxide & Clay (Minerals)</li>
                        <li>Slope (Terrain)</li>
                    </ul>
                </div>
                 <button onClick={onGenerateFeatures} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105">
                   Generate Features
                 </button>
               </>
             ) : (
                <>
                  <p className="text-gray-400 mb-4">The following features are being extracted. Toggle them to explore their spatial distribution on the map once available.</p>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{width: `${((generatedFeatures?.size ?? 0) / FEATURE_LAYERS.length) * 100}%`}}></div>
                  </div>
                  
                  <div className="space-y-2">
                    {FEATURE_LAYERS.map(({ layer, description }, index) => {
                      const isGenerated = generatedFeatures?.has(layer);
                      const isGenerating = isGeneratingFeatures && index === currentlyGeneratingIndex;
                      
                      return (
                        <LayerToggle 
                          key={layer}
                          layer={layer} 
                          activeLayers={activeLayers} 
                          onToggle={onToggleLayer}
                          disabled={!isGenerated}
                          description={description}
                          icon={
                            isGenerating ? <Spinner/> : 
                            (isGenerated ? <CheckIcon className="text-green-400"/> : <div className="w-5 h-5"/>)
                          }
                        />
                      );
                    })}
                  </div>
                </>
             )}
          </div>
        );
      case 'model':
        return (
           <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">3. Train AI Model</h3>
            <div className="text-sm text-gray-400 mb-6">
                <p>The AI is learning from the feature layers to find patterns associated with gold. This process involves:</p>
                <ul className="list-disc list-inside pl-2 mt-2 text-gray-500">
                    <li>Sampling feature data across the map.</li>
                    <li>Correlating data with known deposit locations.</li>
                    <li>Training a predictive Random Forest model.</li>
                </ul>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{width: `${trainingProgress ?? 0}%`}}></div>
            </div>
            <p className="text-sm text-yellow-200/80 text-center mb-6 h-5">{trainingStatusText}</p>

            <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-bold text-md mb-2 text-gray-300">AI Model Insights</h4>
                {isLoadingExplanation ? <Spinner /> : (
                  <p className="text-sm text-gray-400 italic">{modelExplanation}</p>
                )}
            </div>

           </div>
        );
      case 'prediction':
        return (
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">4. Gold Potential Map</h3>
            <div className="text-sm text-gray-400 mb-4">
                <p>The analysis is complete. You can now explore the results:</p>
                <ul className="list-disc list-inside pl-2 mt-2 text-gray-500">
                    <li>Toggle the <span className="font-bold text-gray-300">Gold Potential</span> layer.</li>
                    <li>Read the full <span className="font-bold text-gray-300">Analysis Report</span>.</li>
                    <li>Click deposits on the map for details.</li>
                </ul>
            </div>
            <button onClick={onViewReport} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition duration-200 mb-4">
                View Analysis Report
            </button>
            <Legend />
          </div>
        );
      default:
        return null;
    }
  };

  const isFinalStep = step.id === 'prediction';
  const isFeaturesStepIncomplete = step.id === 'features' && (isGeneratingFeatures || (generatedFeatures?.size ?? 0) < FEATURE_LAYERS.length);
  const isDataStepIncomplete = step.id === 'data' && !['Satellite', 'Elevation', 'Deposits'].some(layer => activeLayers.has(layer as Layer));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        {renderContent()}
      </div>
      <div className="flex gap-4 mt-6">
        {isFinalStep ? (
          <button onClick={onReset} disabled={isProcessing} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
            Start Over
          </button>
        ) : (
          <button onClick={onNext} disabled={isProcessing || step.id === 'start' || isFeaturesStepIncomplete || isDataStepIncomplete} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {isProcessing || isGeneratingFeatures ? <Spinner /> : 'Next Step'}
          </button>
        )}
      </div>
    </div>
  );
};