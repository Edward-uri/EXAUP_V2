import { useState, useCallback } from 'react';
import type { ChartType } from '../../domain/types/ChartTypes';

export const useChartTypes = (initialCount: number, defaultType: ChartType = 'pie') => {
  const [chartTypes, setChartTypes] = useState<ChartType[]>(
    Array(initialCount).fill(defaultType)
  );

  const updateChartType = useCallback((index: number, type: ChartType) => {
    setChartTypes(prev => {
      const updated = [...prev];
      updated[index] = type;
      return updated;
    });
  }, []);

  const resetChartTypes = useCallback((count: number) => {
    setChartTypes(Array(count).fill(defaultType));
  }, [defaultType]);

  return { chartTypes, updateChartType, resetChartTypes };
};
