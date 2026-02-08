import { useState, useEffect } from 'react';
import { SurveyAnalyticsEntity } from '../../domain/entities/SurveyAnalytics';
import type { SurveyAnalytics } from '../../domain/entities/SurveyAnalytics';
import { GetSurveyAnalyticsUseCase } from '../../domain/useCases/GetSurveyAnalyticsUseCase';
import { AnalyticsRepositoryImpl } from '../../data/AnalyticsRepository';
import { analyticsService } from '../../data/AnalyticsService';

interface UseSurveyAnalyticsReturn {
  analytics: SurveyAnalytics | null;
  analyticsEntity: SurveyAnalyticsEntity | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}


/**
 * Hook para obtener y manejar los analytics de una encuesta
 */
export const useSurveyAnalytics = (surveyId: string | undefined): UseSurveyAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [analyticsEntity, setAnalyticsEntity] = useState<SurveyAnalyticsEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.warn('Error al cargar estadísticas:', err);
      setAnalytics(null);
      setAnalyticsEntity(null);
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
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
