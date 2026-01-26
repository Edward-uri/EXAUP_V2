import React from 'react';
import { Check } from 'lucide-react';
import type { StepItem } from '../types';

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="pt-8 pb-4 px-10 border-b border-gray-100">
      <div className="flex justify-between items-center max-w-4xl mx-auto relative">
        {/* Línea de fondo */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2"></div>
        
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                ${isActive || isCompleted ? 'bg-blue-900 border-blue-900 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
              >
                {isCompleted ? <Check size={20} /> : step.icon}
              </div>
              <span className={`text-xs mt-2 font-medium ${isActive ? 'text-blue-900' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;