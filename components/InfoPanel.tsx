
import React from 'react';
import type { GoldDepositPoint, AnalysisResult } from '../types';
import { Spinner } from './Spinner';

interface InfoPanelProps {
  deposit: GoldDepositPoint | null;
  description: string;
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  onClearSelection: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ deposit, description, isLoading, analysisResult, onClearSelection }) => {
  if (deposit) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">{deposit.name}</h3>
          <button onClick={onClearSelection} className="text-gray-500 hover:text-white">&times;</button>
        </div>
        <p className="text-sm text-gray-400 mb-4 italic">{deposit.description}</p>
        <div className="flex-grow overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">{description}</p>
          )}
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Analysis Report</h3>
            <div className="flex-grow overflow-y-auto pr-2 text-gray-300 bg-gray-900/50 p-4 rounded-lg">
               <p className="whitespace-pre-wrap">{analysisResult.summary}</p>
            </div>
        </div>
    );
  }

  return null;
};
