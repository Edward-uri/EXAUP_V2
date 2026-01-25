import type { AnalyticsRepository } from '../domain/useCases/GetSurveyAnalyticsUseCase';
import type { SurveyAnalytics } from '../domain/entities/SurveyAnalytics';
import type { AnalyticsApiResponse } from "../domain/types/AnalyticsApiTypes";
import { AnalyticsService } from './AnalyticsService';
/**
 * Implementación del repositorio que transforma datos de API a entidades de dominio
 */
export class AnalyticsRepositoryImpl implements AnalyticsRepository {
    private service: AnalyticsService = new AnalyticsService();
  constructor(service: AnalyticsService) {
    this.service = service;
  }

  async getSurveyAnalytics(surveyId: string): Promise<SurveyAnalytics> {
    try {
      const response = await this.service.fetchSurveyAnalytics(surveyId);
      
      // Transformar de snake_case (API) a camelCase (Domain)
      return this.mapApiResponseToDomain(response);
    } catch (error) {
      console.error('Error en AnalyticsRepository:', error);
      
      if (error instanceof Error) {
        // Propagar errores conocidos
        throw error;
      }
      
      throw new Error('No se pudieron cargar las estadísticas de la encuesta');
    }
  }

  /**
   * Transforma la respuesta de la API al formato del dominio
   * Separación clara entre API y Domain siguiendo Clean Architecture
   */
  private mapApiResponseToDomain(apiResponse: AnalyticsApiResponse): SurveyAnalytics {
    return {
      surveyId: apiResponse.data.survey_id,
      meta: {
        title: apiResponse.data.meta.title,
        description: apiResponse.data.meta.description,
        totalResponses: apiResponse.data.meta.total_responses
      },
      charts: apiResponse.data.charts.map(chart => ({
        questionId: chart.question_id,
        label: chart.label,
        chartType: this.normalizeChartType(chart.chart_type),
        dataset: chart.dataset.map(datapoint => ({
          label: datapoint.label,
          count: datapoint.count
        }))
      }))
    };
  }

  /**
   * Normaliza el tipo de gráfica del backend a los tipos soportados
   */
  private normalizeChartType(apiChartType: string): string {
    const typeMap: Record<string, string> = {
      'pie': 'pie',
      'donut': 'donut',
      'bar': 'bar',
      'horizontal_bar': 'bar',
      'line': 'line',
      'radar': 'radar',
      'area': 'line' // Convertir area a line si no lo soportamos
    };

    return typeMap[apiChartType.toLowerCase()] || 'pie'; // Default a pie
  }
}
