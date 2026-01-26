import type { SurveyAnalytics } from '../entities/SurveyAnalytics';

export interface AnalyticsRepository {
  getSurveyAnalytics(surveyId: string): Promise<SurveyAnalytics>;
}

/**
 * Caso de uso para obtener analytics de una encuesta
 */
export class GetSurveyAnalyticsUseCase {
    private repository: AnalyticsRepository;
  constructor(repository: AnalyticsRepository) {
    this.repository = repository;
  }

  async execute(surveyId: string): Promise<SurveyAnalytics> {
    if (!surveyId || isNaN(Number(surveyId))) {
      throw new Error('ID de encuesta inválido');
    }

    const analytics = await this.repository.getSurveyAnalytics(surveyId);
    
    if (!analytics.charts || analytics.charts.length === 0) {
      throw new Error('No hay datos de análisis disponibles para esta encuesta');
    }

    if (analytics.meta.totalResponses === 0) {
      throw new Error('Esta encuesta aún no tiene respuestas');
    }

    return analytics;
  }
}
