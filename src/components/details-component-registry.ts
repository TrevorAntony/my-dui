import {
  LineChart,
  BarChart,
  AreaChart,
  CascadeChart,
  ClusteredBarChart,
  DonutChart,
  HeatmapChart,
  PercentStackedBarChart,
  PieChart,
  PolarAreaChart,
  RadarChart,
  RadialBarChart,
  ScoreCardTable,
  StackedBarChart,
  Tile,
  PivotTable,
  DataTable,
  InfiniteScrollTable,
} from "../3dl";

const detailsComponentRegistry: Record<string, React.FC<any>> = {
  "bar-chart": BarChart,
  "line-chart": LineChart,
  "area-chart": AreaChart,
  "cascade-chart": CascadeChart,
  "clustered-bar-chart": ClusteredBarChart,
  "donut-chart": DonutChart,
  "heat-map": HeatmapChart,
  "percentage-stacked-chart": PercentStackedBarChart,
  "pie-chart": PieChart,
  "polar-area-chart": PolarAreaChart,
  "radar-chart": RadarChart,
  "radial-bar-chart": RadialBarChart,
  "score-card": ScoreCardTable,
  "stacked-bar-chart": StackedBarChart,
  tile: Tile,
  "pivot-table": PivotTable,
  "data-table": DataTable,
  "infinite-scroll-table": InfiniteScrollTable,
};

export const getDetailsComponent = (key: string): React.FC<any> | undefined => {
  return detailsComponentRegistry[key];
};
