import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { generateChartConfig } from '../utils/chartConfigs';
import { DEFAULT_DIMENSIONS, MOBILE_DIMENSIONS } from '../../domain/types/ChartTypes';
import type { ChartType } from '../../domain/types/ChartTypes';
import type { ChartDataPoint } from '../../domain/entities/SurveyAnalytics';

interface MetricChartProps {
  data: ChartDataPoint[];
  chartType: ChartType;
  isMobile?: boolean;
  chartRef?: (ref: any) => void;
}

export const MetricChart = ({ 
  data, 
  chartType, 
  isMobile = false,
  chartRef 
}: MetricChartProps) => {
  const dimensions = isMobile ? MOBILE_DIMENSIONS : DEFAULT_DIMENSIONS;

  const chartOption = useMemo(() => 
    generateChartConfig({ data, chartType, isMobile }),
    [data, chartType, isMobile]
  );

  return (
    <div 
      className="flex items-center justify-center"
      style={{
        width: dimensions.containerWidth,
        height: dimensions.containerHeight,
      }}
    >
      <ReactECharts
        key={`chart-${chartType}-${data.length}`}
        ref={chartRef}
        option={chartOption}
        notMerge={true}
        lazyUpdate={false}
        style={{ 
          width: dimensions.renderWidth, 
          height: dimensions.renderHeight 
        }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
