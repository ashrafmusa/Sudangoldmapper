import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { AnalysisStepper } from './components/AnalysisStepper';
import { ControlPanel } from './components/ControlPanel';
import { MapView } from './components/MapView';
import { InfoPanel } from './components/InfoPanel';
import { ANALYSIS_STEPS, KNOWN_DEPOSITS } from './constants';
import type { AnalysisStep, GoldDepositPoint, Layer, AnalysisResult } from './types';
import { getAnalysisSummary, getDepositDescription, getSatelliteUpdateInfo, getModelExplanation } from './services/geminiService';
import { GemIcon } from './components/icons/GemIcon';
import { Toast } from './components/Toast';

const FALLBACK_MODEL_EXPLANATION = "A Random Forest model works like asking a large committee of diverse experts for their opinion before making a final decision. The model builds hundreds of individual 'decision trees' (the experts), and each tree learns slightly different patterns from the map data. To predict if a new, unexplored area has gold potential, the model takes a vote from all the expert trees. This \"wisdom of the crowd\" approach makes the final prediction highly accurate and reliable, which is perfect for cutting through complex geological data to find promising new zones.";

const FALLBACK_ANALYSIS_SUMMARY = `### **GoldMapper Analysis Report**

**Executive Summary**

The AI-driven analysis has successfully identified several new high-potential gold exploration zones in the Eastern Sudan region. By integrating satellite imagery, elevation data, and known deposit locations, the Random Forest model has generated a reliable prediction map that effectively prioritizes areas for follow-up investigation and de-risks future exploration efforts.

**Key Findings**

*   The model confirmed a strong correlation between high-potential zones and the combined presence of significant **iron oxide** and **clay mineral** alterations, particularly along the edges of known geological fault lines.
*   Several previously unexplored areas northwest of the known **Hassai Mine** cluster show a geospatial signature nearly identical to proven deposits, indicating a high probability of new discoveries in that corridor.
*   **Slope** was a key differentiating factor; the model found that moderate slopes (5-15 degrees) were more frequently associated with high-potential zones than extremely flat or steep terrains in this region.

**Recommendation**

It is strongly recommended that field verification and geochemical sampling be prioritized for the high-potential zones identified in the northwestern quadrant of the study area to confirm the model's findings and guide the next phase of exploration.`;


export default function App() {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(ANALYSIS_STEPS[0]);
  const [activeLayers, setActiveLayers] = useState<Set<Layer>>(new Set(['Satellite', 'Deposits']));
  const [selectedDeposit, setSelectedDeposit] = useState<GoldDepositPoint | null>(null);
  const [depositDescription, setDepositDescription] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // State for feature engineering
  const [isGeneratingFeatures, setIsGeneratingFeatures] = useState<boolean>(false);
  const [generatedFeatures, setGeneratedFeatures] = useState<Set<Layer>>(new Set());
  
  // State for real-time satellite updates
  const [satelliteUpdateAvailable, setSatelliteUpdateAvailable] = useState(false);
  const [satelliteUpdateMessage, setSatelliteUpdateMessage] = useState('');
  const [satelliteDataVersion, setSatelliteDataVersion] = useState(1);
  
  // State for model training simulation
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatusText, setTrainingStatusText] = useState('');
  const [modelExplanation, setModelExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  // State for toast notifications
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, key: Date.now() });
  };

  useEffect(() => {
    // Reset and trigger update notification when user reaches the 'data' step
    if (currentStep.id === 'data' && satelliteDataVersion === 1) {
      setSatelliteUpdateAvailable(false);
      const timer = setTimeout(async () => {
        try {
          const message = await getSatelliteUpdateInfo();
          setSatelliteUpdateMessage(message);
          setSatelliteUpdateAvailable(true);
        } catch (error) {
          console.error("Failed to get satellite update info:", error);
          setSatelliteUpdateMessage("New higher-resolution satellite imagery is available.");
          setSatelliteUpdateAvailable(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep.id, satelliteDataVersion]);


  const handleNextStep = useCallback(async () => {
    const currentIndex = ANALYSIS_STEPS.findIndex(step => step.id === currentStep.id);
    if (currentIndex < ANALYSIS_STEPS.length - 1) {
      const nextStep = ANALYSIS_STEPS[currentIndex + 1];
      setCurrentStep(nextStep);
      setSatelliteUpdateAvailable(false); // Hide notification when moving to next step

      if (nextStep.id === 'model') {
        setIsProcessing(true);
        setTrainingProgress(0);
        setTrainingStatusText('');
        setModelExplanation('');
        setIsLoadingExplanation(true);
        
        // Fetch explanation while simulation runs
        getModelExplanation().then(explanation => {
          setModelExplanation(explanation);
        }).catch(err => {
          console.error(err);
          setModelExplanation(FALLBACK_MODEL_EXPLANATION);
        }).finally(() => {
          setIsLoadingExplanation(false);
        });

        // Simulate model training sequence
        setTimeout(() => {
          setTrainingStatusText("Sampling feature data across the map grid...");
          setTrainingProgress(33);
        }, 500);
        
        setTimeout(() => {
          setTrainingStatusText("Joining with known deposit locations...");
          setTrainingProgress(66);
        }, 2500);

        setTimeout(() => {
          setTrainingStatusText("Training Random Forest model...");
          setTrainingProgress(100);
        }, 4500);

        setTimeout(() => {
          setIsProcessing(false);
        }, 6000);
      }
      
      if (nextStep.id === 'prediction') {
        setIsProcessing(true);
        handleSelectDeposit(null); // Ensure info panel shows report first
        try {
          const summary = await getAnalysisSummary();
          setAnalysisResult({ summary });
          setActiveLayers(prev => new Set(prev).add('Gold Potential'));
        } catch (error) {
          console.error("Failed to get analysis summary:", error);
          setAnalysisResult({ summary: FALLBACK_ANALYSIS_SUMMARY });
        } finally {
          setIsProcessing(false);
        }
      }
    }
  }, [currentStep.id]);

  const handleStepClick = useCallback((stepId: AnalysisStep['id']) => {
    const currentIndex = ANALYSIS_STEPS.findIndex(s => s.id === currentStep.id);
    const clickedIndex = ANALYSIS_STEPS.findIndex(s => s.id === stepId);

    // Allow navigation only to previously completed steps
    if (clickedIndex < currentIndex) {
      setCurrentStep(ANALYSIS_STEPS[clickedIndex]);
    }
  }, [currentStep.id]);

  const handleToggleLayer = useCallback((layer: Layer) => {
    setActiveLayers(prev => {
      const newLayers = new Set(prev);
      if (newLayers.has(layer)) {
        newLayers.delete(layer);
      } else {
        newLayers.add(layer);
      }
      return newLayers;
    });
  }, []);

  const handleSelectDeposit = useCallback((deposit: GoldDepositPoint | null) => {
    setSelectedDeposit(deposit);
    setDepositDescription('');
    if (deposit) {
      setIsGeneratingInfo(true);
      getDepositDescription(deposit.name)
        .then(desc => setDepositDescription(desc))
        .catch(error => {
          console.error("Error fetching deposit description:", error);
          setDepositDescription("Could not load details for this location.");
        })
        .finally(() => setIsGeneratingInfo(false));
    }
  }, []);

  const handleSatelliteUpdate = () => {
    setSatelliteDataVersion(prev => prev + 1);
    setSatelliteUpdateAvailable(false);
    showToast("Satellite imagery successfully updated.");
  };
  
  const handleGenerateFeatures = useCallback(() => {
    setIsGeneratingFeatures(true);
    const featuresToGenerate: Layer[] = ['NDVI', 'Iron Oxide', 'Clay', 'Slope'];
    let delay = 0;
    
    featuresToGenerate.forEach(feature => {
      delay += 1000; // Stagger generation for visual effect
      setTimeout(() => {
        setGeneratedFeatures(prev => new Set(prev).add(feature));
        setActiveLayers(prev => new Set(prev).add(feature)); // Auto-activate layer
        
        if (feature === 'Slope') { // Last feature
          setIsGeneratingFeatures(false);
        }
      }, delay);
    });
  }, []);

  const handleViewReport = () => {
    handleSelectDeposit(null);
  };

  const handleReset = () => {
    setCurrentStep(ANALYSIS_STEPS[0]);
    setActiveLayers(new Set(['Satellite', 'Deposits']));
    setSelectedDeposit(null);
    setDepositDescription('');
    setIsProcessing(false);
    setAnalysisResult(null);
    setSatelliteDataVersion(1);
    setSatelliteUpdateAvailable(false);
    setIsGeneratingFeatures(false);
    setGeneratedFeatures(new Set());
    setTrainingProgress(0);
    setTrainingStatusText('');
    setModelExplanation('');
  };

  const isAnalysisStarted = currentStep.id !== 'start';
  const showInfoPanel = selectedDeposit || (currentStep.id === 'prediction' && analysisResult);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
        <div className={`flex-grow flex flex-col gap-4 ${showInfoPanel ? 'lg:w-2/3' : 'lg:w-full'}`}>
          <AnalysisStepper steps={ANALYSIS_STEPS} currentStepId={currentStep.id} onStepClick={handleStepClick} />
          <div className="flex-grow bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border border-gray-700">
            <MapView 
              activeLayers={activeLayers} 
              deposits={KNOWN_DEPOSITS}
              onSelectDeposit={handleSelectDeposit}
              selectedDeposit={selectedDeposit}
              satelliteDataVersion={satelliteDataVersion}
              isTrainingModel={currentStep.id === 'model' && isProcessing}
            />
          </div>
        </div>
        
        <div className={`w-full lg:w-1/3 flex flex-col gap-4 transition-all duration-300 ${isAnalysisStarted ? 'opacity-100' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          {isAnalysisStarted && (
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700 flex flex-col gap-4 h-full">
              {showInfoPanel ? (
                <InfoPanel 
                  deposit={selectedDeposit}
                  description={depositDescription}
                  isLoading={isGeneratingInfo}
                  analysisResult={analysisResult}
                  onClearSelection={() => handleSelectDeposit(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <GemIcon className="w-16 h-16 mb-4"/>
                  <h3 className="text-lg font-bold text-gray-300">Information Panel</h3>
                  <p>Click a gold deposit on the map to view details, or complete the analysis to see the final report.</p>
                </div>
              )}
               <div className="mt-auto pt-4 border-t border-gray-700">
                 <ControlPanel 
                  step={currentStep} 
                  onNext={handleNextStep} 
                  onToggleLayer={handleToggleLayer}
                  activeLayers={activeLayers}
                  isProcessing={isProcessing}
                  onReset={handleReset}
                  onViewReport={handleViewReport}
                  satelliteUpdateAvailable={satelliteUpdateAvailable}
                  satelliteUpdateMessage={satelliteUpdateMessage}
                  onSatelliteUpdate={handleSatelliteUpdate}
                  isGeneratingFeatures={isGeneratingFeatures}
                  generatedFeatures={generatedFeatures}
                  onGenerateFeatures={handleGenerateFeatures}
                  trainingProgress={trainingProgress}
                  trainingStatusText={trainingStatusText}
                  modelExplanation={modelExplanation}
                  isLoadingExplanation={isLoadingExplanation}
                 />
               </div>
            </div>
          )}
        </div>

        {!isAnalysisStarted && (
           <div className="w-full lg:w-1/3 flex flex-col gap-4">
             <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700 flex flex-col gap-4 h-full justify-center">
                <ControlPanel 
                  step={currentStep} 
                  onNext={handleNextStep} 
                  onToggleLayer={handleToggleLayer}
                  activeLayers={activeLayers}
                  isProcessing={isProcessing}
                  onReset={handleReset}
                  onViewReport={() => {}}
                  satelliteUpdateAvailable={false}
                  satelliteUpdateMessage=""
                  onSatelliteUpdate={() => {}}
                 />
             </div>
           </div>
        )}
      </main>
      {toast && <Toast key={toast.key} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}