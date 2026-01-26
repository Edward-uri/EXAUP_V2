/**
 * Tipos específicos para la API - Separados del dominio
 * Siguiendo best practices de TypeScript para APIs
 */

// Response type - Lo que el servidor devuelve
export interface AnalyticsApiResponse {
  data: {
    survey_id: number;
    meta: {
      title: string;
      description: string;
      total_responses: number;
    };
    charts: Array<{
      question_id: string;
      label: string;
      chart_type: string;
      dataset: Array<{
        label: string;
        count: number;
      }>;
    }>;
  };
}

// Si en el futuro necesitas enviar parámetros, defines el Request type aquí
export interface GetAnalyticsRequest {
  surveyId: number;
  filters?: {
    dateFrom?: string;
    dateTo?: string;
  };
}
