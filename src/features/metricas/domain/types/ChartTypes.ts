export type ChartType = 'pie' | 'donut' | 'bar' | 'radar' | 'line';

export interface ChartConfiguration {
  type: ChartType;
  label: string;
  minDataPointsRequired: number;
  disabled?: boolean;
}

export const CHART_CONFIGS: ChartConfiguration[] = [
  { type: 'pie', label: 'Pastel', minDataPointsRequired: 1 },
  { type: 'donut', label: 'Dona', minDataPointsRequired: 1 },
  { type: 'bar', label: 'Barras', minDataPointsRequired: 1 },
  { type: 'line', label: 'Líneas', minDataPointsRequired: 2 },
  { type: 'radar', label: 'Radar', minDataPointsRequired: 3 },
];

export interface ChartDimensions {
  containerWidth: number;
  containerHeight: number;
  renderWidth: number;
  renderHeight: number;
}

export const DEFAULT_DIMENSIONS: ChartDimensions = {
  containerWidth: 460,
  containerHeight: 360,
  renderWidth: 420,
  renderHeight: 300,
};

export const MOBILE_DIMENSIONS: ChartDimensions = {
  containerWidth: 320,
  containerHeight: 300,
  renderWidth: 380,
  renderHeight: 280,
};
