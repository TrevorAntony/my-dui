import PivotTable from "react-pivottable/PivotTable";
import {
  CascadeChart,
  CascadeNode,
  InfiniteScrollTable,
} from "../../../../dashboard-3dl-parser";
import AreaChart from "../../../chart-visuals/area-chart.visual";
import BarChart from "../../../chart-visuals/bar-chart.visual";
import ClusteredBarChart from "../../../chart-visuals/clustered-bar-chart.visual";
import ClusteredLineChart from "../../../chart-visuals/clustered-line-chart.visual";
import DonutChart from "../../../chart-visuals/donut-chart.visual";
import HeatmapChart from "../../../chart-visuals/heat-map-chart.visual";
import LineChart from "../../../chart-visuals/line-chart.visual";
import PercentStackedBarChart from "../../../chart-visuals/percent-stacked-bar-chart.visual";
import PieChart from "../../../chart-visuals/pie-chart.visual";
import PolarAreaChart from "../../../chart-visuals/polar-area-chart.visual";
import RadarChart from "../../../chart-visuals/radar-chart.visual";
import RadialBarChart from "../../../chart-visuals/radial-bar-chart.visual";
import StackedBarChart from "../../../chart-visuals/stacked-bar-chart.visual";
import Tile from "../../../chart-visuals/tile.visual";
import DataTable from "../../../tables/DataTable";
import ScoreCardTable from "../../../tables/score-card-table.visual";

export interface DetailsComponentRegistry {
  "bar-chart": typeof BarChart;
  "line-chart": typeof LineChart;
  "area-chart": typeof AreaChart;
  "cascade-chart": typeof CascadeChart;
  "cascade-node": typeof CascadeNode;
  "clustered-bar-chart": typeof ClusteredBarChart;
  "clustered-line-chart": typeof ClusteredLineChart;
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
  "cascade-node": CascadeNode,
  "clustered-bar-chart": ClusteredBarChart,
  "clustered-line-chart": ClusteredLineChart,
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
  key: K
): DetailsComponentRegistry[K] => {
  return detailsComponentRegistry[key];
};
