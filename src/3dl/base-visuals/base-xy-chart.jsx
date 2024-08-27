import React from "react";
import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../utilities/DataContainer";
import { deepCopy, deepMerge } from "../../helpers/visual-helpers";

const BaseXYChart = ({ chartType = "bar", isHorizontal, userOptions }) => {
  const theme = useThemeContext();
  const data = useDataContext();

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  const isMultiSeries = typeof data[0] === "object" && !("value" in data[0]);

  let categories, chartSeries;

  if (isMultiSeries) {
    categories = data.map((item) => item.category || "Unknown");
    const seriesKeys = Object.keys(data[0]).filter((key) => key !== "category");
    chartSeries = seriesKeys.map((key) => ({
      name: key,
      data: data.map((item) => item[key] || 0),
    }));
  } else {
    categories = data.map((item) => item.category || "Unknown");
    const seriesData = data.map((item) => item.value || 0);

    chartSeries = [
      {
        name: "Quantity",
        data: seriesData,
      },
    ];
  }

  const { apex: apexOptions } = theme.themes[0];

  const chartOptions = {
    chart: {
      id: "basic-chart",
      stacked: isMultiSeries
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
        formatter: (val) => `${val}`,
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
    <div style={{ width: "100%", maxWidth: "100%", height: "auto" }}>
      <Chart options={mergerdOptions} series={chartSeries} type={chartType} />
    </div>
  );
};

export default BaseXYChart;
