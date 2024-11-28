import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../context/DataContext";
import { deepCopy, deepMerge } from "../../helpers/visual-helpers";
import EmptyState from "../ui-elements/empty-state";
import type { ChartType } from "../types/types";
import ChartSkeleton from "../../ui-components/chart-skeleton";

type DataItem = {
  category?: string;
  value?: number;
  [key: string]: unknown;
};

const BaseXYChart = ({
  chartType = "pie",
  userOptions = {},
  isHorizontal,
}: {
  chartType?: ChartType;
  userOptions?: object;
  isHorizontal?: boolean;
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

  if (!theme || !Object.keys(theme).length)
    return <div>No theme available</div>;

  const isMultiSeries = typeof data[0] === "object" && !("value" in data[0]);

  let categories, chartSeries;

  if (isMultiSeries) {
    categories = (data as DataItem[]).map((item) => item.category || "Unknown");
    const seriesKeys = Object.keys(data[0]).filter((key) => key !== "category");
    chartSeries = seriesKeys.map((key) => ({
      name: key,
      data: data.map((item) => item[key] || 0),
    }));
  } else {
    categories = (data as DataItem[]).map((item) => item.category || "Unknown");
    const seriesData = (data as DataItem[]).map((item) => item.value || 0);

    chartSeries = [
      {
        name: "Quantity",
        data: seriesData,
      },
    ];
  }

  const { apex: apexOptions } = theme["themes"][0];

  const chartOptions = {
    chart: {
      id: "basic-chart",
      stacked: isMultiSeries,
    },
    xaxis: {
      categories,
    },
    plotOptions: {
      bar: {
        horizontal: isHorizontal || false,
        distributed: !isMultiSeries,
        borderRadius: 5,
      },
    },
    colors: ["#00E396", "#FF4560", "#775DD0", "#FEB019"],
    stroke: {
      show: true,
      width: isMultiSeries ? 1 : 2,
      colors: isMultiSeries ? ["#fff"] : undefined,
    },
    legend: {
      position: "top",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: unknown) => `${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 1000, // Adjust the breakpoint as necessary
        options: {
          chart: {
            width: "100%", // Set to 100% width below the breakpoint
          },
        },
      },
    ],
  };

  const copiedOptions = deepCopy(apexOptions);
  let mergerdOptions = deepMerge(chartOptions, copiedOptions);
  mergerdOptions = deepMerge(mergerdOptions, userOptions);

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
        options={mergerdOptions}
        series={chartSeries}
        type={chartType as ChartType}
        height={"100%"}
      />
    </div>
  );
};

export default BaseXYChart;
