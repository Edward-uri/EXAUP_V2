import type { MutableRefObject } from 'react';

interface ChartExportOptions {
  chartRefs: MutableRefObject<Array<any | null>>;
  totalCharts: number;
  pixelRatio?: number;
  backgroundColor?: string;
}

/**
 * Captura las gráficas de ECharts como imágenes base64
 */
export class ChartExporter {
  private options: ChartExportOptions;

  constructor(options: ChartExportOptions) {
    this.options = {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      ...options
    };
  }

  private async waitForFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getChartInstance(index: number): any | null {
    const ref = this.options.chartRefs.current[index];
    if (!ref) return null;
    
    const instance = ref.getEchartsInstance?.();
    return instance || null;
  }

  /**
   * Captura una sola gráfica con reintentos
   */
  private async captureChart(index: number, retries = 4): Promise<string> {
    const instance = this.getChartInstance(index);
    
    if (!instance || typeof instance.getDataURL !== 'function') {
      console.warn(`Chart ${index}: instancia no válida`);
      return '';
    }

    let dataUrl = '';
    for (let attempt = 0; attempt < retries; attempt++) {
      instance.resize?.();
      await this.waitForFrame();
      await this.sleep(160);
      
      dataUrl = instance.getDataURL({
        pixelRatio: this.options.pixelRatio,
        backgroundColor: this.options.backgroundColor
      });

      if (dataUrl && dataUrl.length > 200) {
        return dataUrl;
      }
    }
    
    return dataUrl;
  }

  /**
   * Captura todas las gráficas
   */
  async captureAll(globalRetries = 6, perChartRetries = 4): Promise<string[]> {
    let images: string[] = [];

    for (let attempt = 0; attempt < globalRetries; attempt++) {
      await this.waitForFrame();
      await this.sleep(300);

      images = await Promise.all(
        Array.from({ length: this.options.totalCharts }, (_, i) =>
          this.captureChart(i, perChartRetries)
        )
      );

      const allValid = images.every(img => img && img.length > 200);
      if (allValid) {
        return images;
      }
    }

    return images;
  }
}
