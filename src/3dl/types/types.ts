export interface ContainerComponentProps {
  header: string;
  subHeader?: string;
  variant?: "card" | "default";
  children: React.ReactNode;
  query?: string;
  exportData?: string | boolean;
  detailsComponent?: string;
}

export interface ChartDataItem {
  value?: number;
  category?: string;
}

export type ChartType =
  | "area"
  | "line"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap";

export type Options = {
  w: {
    globals: {
      labels: string[];
    };
  };
  seriesIndex: number;
};
