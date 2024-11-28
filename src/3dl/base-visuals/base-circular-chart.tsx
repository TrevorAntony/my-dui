import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../context/DataContext";
import { deepCopy, deepMerge } from "../../helpers/visual-helpers";
import type { ChartDataItem, ChartType, Options } from "../types/types";
import EmptyState from "../ui-elements/empty-state";
import ChartSkeleton from "../../ui-components/chart-skeleton";

const BaseCircularChart = ({
  chartType = "pie",
  userOptions = {},
}: {
  chartType: ChartType;
  userOptions?: object;
}) => {
  const theme = useThemeContext();
  const { data, loading } = useDataContext();

  if (loading) {
    return <ChartSkeleton />;
  }

  if (!loading && Array.isArray(data) && data.length === 0) {
    return <EmptyState message="No data available for this chart" />;
  }

  if (!data) {
    return null;
  }

  const { apex: apexOptions } = theme["themes"][0];

  const chartData = {
    series: data.map((item: ChartDataItem) => item.value || 0),
    chart: {
      type: chartType,
      id: "circular-chart",
    },
    dataLabels: {
      formatter: function (opts: Options) {
        const label = opts.w.globals.labels[opts.seriesIndex];
        return `${label}`;
      },
      background: {
        enabled: true,
        borderColor: "#fff",
      },
      dropShadow: {
        enabled: true,
      },
      style: { colors: ["#626b77"] },
    },
    labels: data.map((item: ChartDataItem) => item.category || "Unknown"),
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
            offsetX: 0,
            offsetY: 0,
          },
        },
      },
    ],
  };

  let mergedOptions = deepMerge(deepCopy(chartData), deepCopy(apexOptions));

  mergedOptions = deepMerge(mergedOptions, userOptions as object);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "300px",
        overflow: "hidden",
      }}
    >
      <Chart
        options={mergedOptions}
        series={mergedOptions.series}
        type={chartType as ChartType}
        height={"100%"}
      />
    </div>
  );
};

export default BaseCircularChart;
