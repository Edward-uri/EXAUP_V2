import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSurveyAnalytics } from '../hooks/useSurveyAnalytics';
import { useChartTypes } from '../hooks/useChartTypes';
import { useChartExport } from '../hooks/useChartExport';
import { MetricQuestionCard } from '../components/MetricQuestionCard';
import { 
  PrinterIcon, 
  ArrowLeftIcon,
  ChartBarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '../../../../constants/routes';

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analytics, analyticsEntity, loading, error, refetch } = useSurveyAnalytics(id);
  const { chartTypes, updateChartType } = useChartTypes(analytics?.charts.length || 0);
  const { chartRefs, handlePrint } = useChartExport({ 
    totalCharts: analytics?.charts.length || 0 
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics || !analyticsEntity) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <ChartBarIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar estadísticas</h2>
          <p className="text-red-600 mb-6">{error || 'Datos no disponibles'}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => navigate(ROUTES.ENCUESTAS)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button 
              onClick={() => refetch()} 
              className="px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = analyticsEntity.getAggregatedStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-20">
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header con Metadata */}
        <div id="metric-header" className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {/* Botón Volver - Oculto en impresión */}
            <button
              onClick={() => navigate(ROUTES.ENCUESTAS)}
              className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-gray-900 print:hidden"
              aria-label="Volver"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            {/* Título y descripción - Visible en impresión */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1 print:text-2xl">
                {analytics.meta.title}
              </h1>
              {analytics.meta.description && (
                <p className="text-gray-600 text-sm print:text-xs">
                  {analytics.meta.description}
                </p>
              )}
            </div>
            
            {/* Botón Imprimir - Oculto en impresión */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-800 transition-all shadow-sm hover:shadow-md print:hidden"
            >
              <PrinterIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>

          {/* Tarjetas de Estadísticas - OCULTAS EN IMPRESIÓN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DocumentChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Preguntas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Respuestas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalResponses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Promedio por Pregunta</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgResponsesPerQuestion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <div id="metric-metrics" className="space-y-6">
          {analytics.charts.map((chartData, index) => (
            <MetricQuestionCard
              key={chartData.questionId}
              chartData={chartData}
              chartType={chartTypes[index] || 'pie'}
              onChartTypeChange={(type) => updateChartType(index, type)}
              chartIndex={index}
              isMobile={isMobile}
              chartRef={(ref) => { chartRefs.current[index] = ref; }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
