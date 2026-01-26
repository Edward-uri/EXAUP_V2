import axios from "axios";
import type { AnalyticsApiResponse } from "../domain/types/AnalyticsApiTypes";

/**
 * Servicio para comunicación con el endpoint de analytics
 * Usa una URL directa porque este endpoint no tiene el prefijo /api
 */
export class AnalyticsService {
  private baseURL = 'http://localhost:3000';
  private basePath = '/analytics/survey';

  /**
   * Obtiene las estadísticas de una encuesta específica
   * GET http://localhost:3000/analytics/survey/{id_encuesta}
   */
  async fetchSurveyAnalytics(surveyId: string): Promise<AnalyticsApiResponse> {
    try {
      const response = await axios.get<AnalyticsApiResponse>(
        `${this.baseURL}${this.basePath}/${surveyId}`
      );
      
      return response.data;
    } catch (error: any) {
      // Manejo de errores específicos del API
      if (error.response?.status === 404) {
        throw new Error('Encuesta no encontrada');
      }
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permiso para ver estas estadísticas');
      }

      if (error.response?.status === 500) {
        throw new Error('Error del servidor al obtener estadísticas');
      }

      throw error;
    }
  }

  /**
   * Método futuro para exportar analytics (si el backend lo soporta)
   */
  async exportAnalyticsPDF(surveyId: string): Promise<Blob> {
    const response = await axios.get(
      `${this.baseURL}${this.basePath}/${surveyId}/export`,
      { responseType: 'blob' }
    );
    return response.data;
  }
}

// Singleton para usar en toda la aplicación
export const analyticsService = new AnalyticsService();
