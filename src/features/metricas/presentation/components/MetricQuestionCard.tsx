import { ChartTypeSelector } from './ChartTypeSelector';
import { MetricChart } from './MetricChart';
import type { ChartType } from '../../domain/types/ChartTypes';
import type { ChartData } from '../../domain/entities/SurveyAnalytics';

interface MetricQuestionCardProps {
  chartData: ChartData; // Ahora usa el tipo del dominio
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  chartIndex: number;
  isMobile?: boolean;
  chartRef?: (ref: any) => void;
}

export const MetricQuestionCard = ({
  chartData,
  chartType,
  onChartTypeChange,
  chartIndex,
  isMobile = false,
  chartRef
}: MetricQuestionCardProps) => {
  const totalResponses = chartData.dataset.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      data-metric-index={chartIndex}
      className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Columna Izquierda: Pregunta y Opciones */}
        <div className="lg:w-4/12">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {chartData.label}
            </h3>
            <p className="text-xs text-gray-500">
              Total de respuestas: <span className="font-semibold text-gray-700">{totalResponses}</span>
            </p>
          </div>
          
          <div className="space-y-2.5">
            {chartData.dataset.map((datapoint, idx) => {
              const percentage = totalResponses > 0 
                ? ((datapoint.count / totalResponses) * 100).toFixed(1)
                : '0';
              
              return (
                <div
                  key={`${chartData.questionId}-${idx}`}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2.5 border border-gray-100"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full shrink-0 bg-gradient-to-br from-blue-500 to-blue-600" />
                    <span className="text-gray-700 truncate font-medium">{datapoint.label}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <span className="text-xs text-gray-500">{percentage}%</span>
                    <span className="text-gray-900 font-semibold min-w-8 text-right">
                      {datapoint.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Selector y Gráfica */}
        <div className="lg:w-8/12 flex flex-col">
          <div className="flex justify-end mb-3">
            <ChartTypeSelector
              value={chartType}
              onChange={onChartTypeChange}
              minResponses={chartData.dataset.length}
            />
          </div>

          <div 
            data-chart-index={chartIndex} 
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 p-4"
          >
            <MetricChart
              data={chartData.dataset}
              chartType={chartType}
              isMobile={isMobile}
              chartRef={chartRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
