import { useRef, useEffect, useCallback } from 'react';
import { ChartExporter } from '../utils/chartExporter';
import { generatePrintWindow } from '../utils/printHandler';
import { useAlert } from '../../../../shared/components/Alert';

interface UseChartExportOptions {
  totalCharts: number;
  headerId?: string;
}

export const useChartExport = ({ 
  totalCharts, 
  headerId = 'metric-header' 
}: UseChartExportOptions) => {
  const chartRefs = useRef<Array<any | null>>([]);
  const alert = useAlert();

  const handlePrint = useCallback(async () => {
    try {
      const exporter = new ChartExporter({ chartRefs, totalCharts });
      const images = await exporter.captureAll();

      if (images.every(img => !img || img.length <= 200)) {
        alert.warning('Exportacion incompleta', 'No se pudieron generar las imágenes de las gráficas. Intenta de nuevo.');
        return;
      }

      generatePrintWindow({
        images,
        headerId,
        onError: (message) => alert.error('Impresion bloqueada', message)
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      window.print();
    }
  }, [totalCharts, headerId, alert]);

  useEffect(() => {
    const handler = () => handlePrint();
    window.addEventListener('request-metrics-print', handler);
    return () => window.removeEventListener('request-metrics-print', handler);
  }, [handlePrint]);

  return { chartRefs, handlePrint };
};
