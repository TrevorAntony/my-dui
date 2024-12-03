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

export interface DetailsComponentRegistry {
  "bar-chart": typeof BarChart;
  "line-chart": typeof LineChart;
  "area-chart": typeof AreaChart;
  "cascade-chart": typeof CascadeChart;
  "clustered-bar-chart": typeof ClusteredBarChart;
  "donut-chart": typeof DonutChart;
  "heat-map": typeof HeatmapChart;
  "percentage-stacked-chart": typeof PercentStackedBarChart;
  "pie-chart": typeof PieChart;
  "polar-area-chart": typeof PolarAreaChart;
  "radar-chart": typeof RadarChart;
  "radial-bar-chart": typeof RadialBarChart;
  "score-card": typeof ScoreCardTable;
  "stacked-bar-chart": typeof StackedBarChart;
  tile: typeof Tile;
  "pivot-table": typeof PivotTable;
  "data-table": typeof DataTable;
  "infinite-scroll-table": typeof InfiniteScrollTable;
}

const detailsComponentRegistry: DetailsComponentRegistry = {
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

export const getDetailsComponent = <K extends keyof DetailsComponentRegistry>(
  key: K,
): DetailsComponentRegistry[K] => {
  return detailsComponentRegistry[key];
};
