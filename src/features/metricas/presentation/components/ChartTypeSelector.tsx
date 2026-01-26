import { useState, useEffect, useRef } from 'react';
import { CHART_CONFIGS } from '../../domain/types/ChartTypes';
import type { ChartType } from '../../domain/types/ChartTypes';

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
  minResponses: number;
}

export const ChartTypeSelector = ({ 
  value, 
  onChange, 
  minResponses 
}: ChartTypeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableConfigs = CHART_CONFIGS.map(config => ({
    ...config,
    disabled: minResponses < config.minDataPointsRequired
  }));

  const currentLabel = availableConfigs.find(c => c.type === value)?.label || 'Tipo de gráfica';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-auto print-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        aria-label="Seleccionar tipo de gráfica"
      >
        {currentLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {availableConfigs.map(config => (
            <button
              key={config.type}
              onClick={() => {
                if (!config.disabled) {
                  onChange(config.type);
                  setIsOpen(false);
                }
              }}
              disabled={config.disabled}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                config.disabled
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-blue-50 cursor-pointer'
              } ${value === config.type ? 'bg-blue-100 font-semibold' : ''}`}
            >
              {config.label}
              {config.disabled && ' (mín. ' + config.minDataPointsRequired + ' opciones)'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
