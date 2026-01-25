import type { EChartsOption } from 'echarts';
import type { ChartType } from '../../domain/types/ChartTypes';
import type { ChartDataPoint } from '../../domain/entities/SurveyAnalytics';

export const CHART_COLORS = [
  '#5B8FF9', '#7FB7FF', '#9FD6FF', 
  '#C3E9FF', '#9CCFD9', '#8FB7D9',
  '#FFB6C1', '#FFD700', '#98FB98'
];

interface ChartConfigParams {
  data: ChartDataPoint[]; // Ahora usa el tipo del dominio
  chartType: ChartType;
  isMobile?: boolean;
}

export const generateChartConfig = ({ 
  data, 
  chartType, 
  isMobile = false 
}: ChartConfigParams): EChartsOption => {
  const chartData = data.map((item, i) => ({
    name: item.label,
    value: item.count,
    itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] }
  }));

  const maxValue = Math.max(...data.map(d => d.count), 1);

  switch (chartType) {
    case 'pie':
    case 'donut':
      return getPieConfig(chartData, chartType, isMobile);
    
    case 'bar':
      return getBarConfig(chartData, maxValue, isMobile);
    
    case 'line':
      return getLineConfig(chartData, maxValue, isMobile);
    
    case 'radar':
      return getRadarConfig(chartData, maxValue);
    
    default:
      return getPieConfig(chartData, 'pie', isMobile);
  }
};

const getPieConfig = (
  data: any[], 
  type: 'pie' | 'donut', 
  isMobile: boolean
): EChartsOption => ({
  tooltip: { 
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: { 
    top: '5%', 
    left: 'center',
    textStyle: { fontSize: isMobile ? 10 : 12 }
  },
  series: [{
    name: 'Respuestas',
    type: 'pie',
    radius: type === 'donut' ? ['40%', '70%'] : ['0%', '70%'],
    center: ['50%', isMobile ? '60%' : '55%'],
    padAngle: 8,
    itemStyle: { borderRadius: 10 },
    label: {
      show: true,
      position: 'outside',
      formatter: '{b}: {c}',
      fontSize: isMobile ? 10 : 12,
      distance: 10,
    },
    labelLine: { show: true, length: 14, length2: 8 },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' }
    },
    data
  }]
});

const getBarConfig = (
  data: any[], 
  maxValue: number, 
  isMobile: boolean
): EChartsOption => ({
  tooltip: { 
    trigger: 'axis', 
    axisPointer: { type: 'shadow' }
  },
  grid: { 
    left: isMobile ? 8 : 16, 
    right: isMobile ? 8 : 16, 
    bottom: 32, 
    top: 48,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: data.map(d => d.name),
    axisLine: { lineStyle: { color: '#E5E7EB' } },
    axisTick: { show: false },
    axisLabel: { 
      color: '#6B7280',
      fontSize: isMobile ? 10 : 12,
      rotate: data.length > 5 && isMobile ? 45 : 0,
      interval: 0
    }
  },
  yAxis: {
    type: 'value',
    max: Math.ceil(maxValue * 1.15),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#6B7280', fontSize: isMobile ? 10 : 12 },
    splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } }
  },
  series: [{
    type: 'bar',
    barWidth: isMobile ? 24 : 36,
    data,
    label: {
      show: true,
      position: 'top',
      formatter: '{c}',
      fontSize: isMobile ? 10 : 12,
      color: '#374151',
      fontWeight: 'bold'
    },
    emphasis: { 
      itemStyle: { 
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.2)' 
      } 
    }
  }]
});

const getLineConfig = (
  data: any[], 
  maxValue: number, 
  isMobile: boolean
): EChartsOption => ({
  tooltip: { 
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  grid: { 
    left: 16, 
    right: 16, 
    bottom: 32, 
    top: 48,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: data.map(d => d.name),
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#E5E7EB' } },
    axisTick: { show: false },
    axisLabel: { 
      color: '#6B7280',
      fontSize: isMobile ? 10 : 12
    }
  },
  yAxis: {
    type: 'value',
    max: Math.ceil(maxValue * 1.15),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#6B7280' },
    splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } }
  },
  series: [{
    type: 'line',
    data: data.map(d => d.value),
    smooth: true,
    lineStyle: { 
      width: 3,
      color: CHART_COLORS[0]
    },
    itemStyle: { 
      color: CHART_COLORS[0],
      borderWidth: 2
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: CHART_COLORS[0] + '40' },
          { offset: 1, color: CHART_COLORS[0] + '05' }
        ]
      }
    },
    emphasis: {
      focus: 'series',
      itemStyle: { borderWidth: 3 }
    }
  }]
});

const getRadarConfig = (data: any[], maxValue: number): EChartsOption => ({
  tooltip: {
    trigger: 'item'
  },
  radar: {
    indicator: data.map(d => ({ 
      name: d.name, 
      max: Math.ceil(maxValue * 1.2) 
    })),
    radius: '65%',
    axisName: {
      color: '#6B7280',
      fontSize: 12
    },
    splitArea: {
      areaStyle: {
        color: ['#F9FAFB', '#F3F4F6', '#E5E7EB']
      }
    }
  },
  series: [{
    type: 'radar',
    data: [{
      value: data.map(d => d.value),
      name: 'Respuestas',
      itemStyle: { color: CHART_COLORS[0] },
      areaStyle: { color: CHART_COLORS[0], opacity: 0.25 },
      lineStyle: { color: CHART_COLORS[0], width: 2 },
      label: { 
        show: true, 
        formatter: '{c}',
        color: '#374151',
        fontWeight: 'bold'
      }
    }],
    emphasis: {
      lineStyle: { width: 3 }
    }
  }]
});
