export interface SurveyAnalytics {
  surveyId: number;
  meta: SurveyMetadata;
  charts: ChartData[];
}

export interface SurveyMetadata {
  title: string;
  description: string;
  totalResponses: number;
}

export interface ChartData {
  questionId: string;
  label: string;
  chartType: string;
  dataset: ChartDataPoint[];
}

export interface ChartDataPoint {
  label: string;
  count: number;
}

/**
 * Clase de dominio con lógica de negocio
 */
export class SurveyAnalyticsEntity {
  private analytics: SurveyAnalytics;

  constructor(analytics: SurveyAnalytics) {
    this.analytics = analytics;
  }

  /**
   * Obtiene el total de respuestas de la encuesta
   */
  getTotalResponses(): number {
    return this.analytics.meta.totalResponses;
  }

  /**
   * Obtiene las gráficas ordenadas por número de respuestas (mayor a menor)
   */
  getChartsSortedByResponses(): ChartData[] {
    return [...this.analytics.charts].sort((a, b) => {
      const sumA = a.dataset.reduce((acc, item) => acc + item.count, 0);
      const sumB = b.dataset.reduce((acc, item) => acc + item.count, 0);
      return sumB - sumA;
    });
  }

  /**
   * Obtiene una gráfica específica por ID de pregunta
   */
  getChartByQuestionId(questionId: string): ChartData | undefined {
    return this.analytics.charts.find(chart => chart.questionId === questionId);
  }

  /**
   * Valida que haya suficientes datos para mostrar métricas
   */
  hasValidData(): boolean {
    return (
      this.analytics.charts.length > 0 &&
      this.analytics.meta.totalResponses > 0
    );
  }

  /**
   * Calcula estadísticas agregadas
   */
  getAggregatedStats() {
    const totalQuestions = this.analytics.charts.length;
    const avgResponsesPerQuestion = totalQuestions > 0
      ? this.analytics.meta.totalResponses / totalQuestions
      : 0;

    return {
      totalQuestions,
      totalResponses: this.analytics.meta.totalResponses,
      avgResponsesPerQuestion: Math.round(avgResponsesPerQuestion * 10) / 10
    };
  }

  getRawData(): SurveyAnalytics {
    return this.analytics;
  }
}
