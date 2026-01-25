import { useState, useEffect } from 'react';
import { SurveyAnalyticsEntity } from '../../domain/entities/SurveyAnalytics';
import type { SurveyAnalytics } from '../../domain/entities/SurveyAnalytics';
import { GetSurveyAnalyticsUseCase } from '../../domain/useCases/GetSurveyAnalyticsUseCase';
import { AnalyticsRepositoryImpl } from '../../data/AnalyticsRepository';
import { analyticsService } from '../../data/AnalyticsService';
import { useToast } from '../../../../shared/components/Toast/ToastContext';

interface UseSurveyAnalyticsReturn {
  analytics: SurveyAnalytics | null;
  analyticsEntity: SurveyAnalyticsEntity | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Datos de prueba para visualización
const getMockAnalytics = (surveyId: string): SurveyAnalytics => ({
  surveyId: parseInt(surveyId),
  meta: {
    title: 'Encuesta de Satisfacción 2026 (Datos de Prueba)',
    description: 'Encuesta para medir la satisfacción de los egresados con el programa académico',
    totalResponses: 156
  },
  charts: [
    {
      questionId: 'q1',
      label: '¿Cómo calificarías tu experiencia general?',
      chartType: 'pie',
      dataset: [
        { label: 'Excelente', count: 78 },
        { label: 'Muy bueno', count: 52 },
        { label: 'Bueno', count: 18 },
        { label: 'Regular', count: 6 },
        { label: 'Malo', count: 2 }
      ]
    },
    {
      questionId: 'q2',
      label: '¿Qué tan relevante fue el contenido académico?',
      chartType: 'bar',
      dataset: [
        { label: 'Muy relevante', count: 95 },
        { label: 'Relevante', count: 48 },
        { label: 'Poco relevante', count: 10 },
        { label: 'Nada relevante', count: 3 }
      ]
    },
    {
      questionId: 'q3',
      label: 'Evolución de competencias adquiridas',
      chartType: 'line',
      dataset: [
        { label: 'Año 1', count: 45 },
        { label: 'Año 2', count: 68 },
        { label: 'Año 3', count: 92 },
        { label: 'Año 4', count: 115 },
        { label: 'Egresado', count: 135 }
      ]
    },
    {
      questionId: 'q4',
      label: 'Áreas de desarrollo profesional',
      chartType: 'radar',
      dataset: [
        { label: 'Liderazgo', count: 88 },
        { label: 'Trabajo en equipo', count: 95 },
        { label: 'Comunicación', count: 82 },
        { label: 'Técnicas', count: 120 },
        { label: 'Innovación', count: 75 },
        { label: 'Gestión', count: 68 }
      ]
    },
    {
      questionId: 'q5',
      label: 'Sector de empleo actual',
      chartType: 'donut',
      dataset: [
        { label: 'Tecnología', count: 58 },
        { label: 'Consultoría', count: 32 },
        { label: 'Manufactura', count: 24 },
        { label: 'Servicios', count: 22 },
        { label: 'Gobierno', count: 12 },
        { label: 'Otros', count: 8 }
      ]
    }
  ]
});

/**
 * Hook para obtener y manejar los analytics de una encuesta
 */
export const useSurveyAnalytics = (surveyId: string | undefined): UseSurveyAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [analyticsEntity, setAnalyticsEntity] = useState<SurveyAnalyticsEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!surveyId) {
      setLoading(false);
      return;
    }

    loadAnalytics();
  }, [surveyId]);

  const loadAnalytics = async () => {
    if (!surveyId) return;

    setLoading(true);
    setError(null);

    try {
      const repository = new AnalyticsRepositoryImpl(analyticsService);
      const useCase = new GetSurveyAnalyticsUseCase(repository);
      const data = await useCase.execute(surveyId);
      
      setAnalytics(data);
      setAnalyticsEntity(new SurveyAnalyticsEntity(data));
    } catch (err) {
      console.warn('Error al cargar datos reales, usando datos de prueba:', err);
      
      // Usar datos de prueba si falla la carga
      const mockData = getMockAnalytics(surveyId);
      setAnalytics(mockData);
      setAnalyticsEntity(new SurveyAnalyticsEntity(mockData));
      
      toast.info(
        'Usando datos de prueba', 
        'No hay respuestas reales. Mostrando datos de ejemplo para visualización.'
      );
    } finally {
      setLoading(false);
    }
  };

  return { 
    analytics, 
    analyticsEntity,
    loading, 
    error, 
    refetch: loadAnalytics 
  };
};
