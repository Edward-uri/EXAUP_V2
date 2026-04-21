import React from 'react';
import { Check } from 'lucide-react';
import type { StepItem } from '../types';

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="pt-10 pb-6 px-4 md:px-12 border-b border-gray-100 bg-white/50 backdrop-blur-md">
      <div className="flex justify-between items-center max-w-3xl mx-auto relative">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full -z-0"></div>
        {/* Progress Bar Fill */}
        <div 
            className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full -z-0 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out shadow-sm
                ${isActive ? 'bg-blue-600 text-white shadow-blue-600/30 scale-110' 
                  : isCompleted ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-slate-200 text-slate-400'}`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.icon}
              </div>
              <span 
                className={`absolute -bottom-8 w-32 text-center text-[11px] font-bold tracking-wide uppercase transition-colors duration-300
                ${isActive ? 'text-blue-900' : isCompleted ? 'text-blue-600/80' : 'text-slate-400'}`}
              >
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