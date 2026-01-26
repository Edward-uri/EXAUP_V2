import { useRef, useEffect, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import { ChartExporter } from '../utils/chartExporter';
import { generatePrintWindow } from '../utils/printHandler';

interface UseChartExportOptions {
  totalCharts: number;
  headerId?: string;
  metricsId?: string;
}

export const useChartExport = ({ 
  totalCharts, 
  headerId = 'metric-header',
  metricsId = 'metric-metrics' 
}: UseChartExportOptions) => {
  const chartRefs = useRef<Array<any | null>>([]);

  const handlePrint = useCallback(async () => {
    try {
      const exporter = new ChartExporter({ chartRefs, totalCharts });
      const images = await exporter.captureAll();

      if (images.every(img => !img || img.length <= 200)) {
        alert('No se pudieron generar las imágenes de las gráficas. Intenta de nuevo.');
        return;
      }

      generatePrintWindow({
        images,
        headerId,
        metricsId
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      window.print();
    }
  }, [totalCharts, headerId, metricsId]);

  useEffect(() => {
    const handler = () => handlePrint();
    window.addEventListener('request-metrics-print', handler);
    return () => window.removeEventListener('request-metrics-print', handler);
  }, [handlePrint]);

  return { chartRefs, handlePrint };
};
