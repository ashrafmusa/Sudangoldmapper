import React from 'react';
import type { AnalysisStep } from '../types';
import { DataIcon } from './icons/DataIcon';
import { FeatureIcon } from './icons/FeatureIcon';
import { ModelIcon } from './icons/ModelIcon';
import { PredictionIcon } from './icons/PredictionIcon';
import { StartIcon } from './icons/StartIcon';

interface AnalysisStepperProps {
  steps: AnalysisStep[];
  currentStepId: string;
  onStepClick: (stepId: AnalysisStep['id']) => void;
}

const ICONS: Record<AnalysisStep['id'], React.FC<{className?: string}>> = {
  start: StartIcon,
  data: DataIcon,
  features: FeatureIcon,
  model: ModelIcon,
  prediction: PredictionIcon
}

export const AnalysisStepper: React.FC<AnalysisStepperProps> = ({ steps, currentStepId, onStepClick }) => {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => {
            const Icon = ICONS[step.id];
            const isCompleted = stepIdx < currentIndex;
            const isCurrent = stepIdx === currentIndex;
            const isClickable = isCompleted;

            return (
              <li key={step.title} className={`relative group ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                <div
                  onClick={() => isClickable && onStepClick(step.id)}
                  className={`flex items-center text-sm font-medium ${isClickable ? 'cursor-pointer' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    isCompleted ? 'bg-yellow-500 hover:bg-yellow-600' : isCurrent ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </span>
                  <div className="ml-4 hidden md:flex flex-col">
                    <span className={`text-xs font-semibold tracking-wide uppercase ${
                       isCompleted || isCurrent ? 'text-yellow-400' : 'text-gray-400'
                    }`}>{step.title}</span>
                    <span className="text-xs text-gray-500">{step.description}</span>
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {isCompleted ? "Click to review" : isCurrent ? "Current Step" : "Upcoming"}
                </div>

                {stepIdx < steps.length - 1 ? (
                  <div className="absolute inset-0 top-5 left-4 -z-10 hidden h-0.5 w-full bg-gray-600 md:block" aria-hidden="true">
                    <div className={`h-0.5 bg-yellow-500 transition-all duration-500`} style={{width: stepIdx < currentIndex ? '100%' : '0%'}}></div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};