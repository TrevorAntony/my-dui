import React from "react";
import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../context/DataContext";
import { deepCopy, deepMerge } from "../../helpers/visual-helpers";

const BaseCircularChart = ({ chartType = "pie", userOptions = {} }) => {
  const theme = useThemeContext();
  const { data } = useDataContext();

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available to render the chart.</div>;
  }

  const { apex: apexOptions } = theme.themes[0];

  const chartData = {
    series: data.map((item) => item.value || 0),
    chart: {
      type: chartType,
      id: "circular-chart",
    },
    dataLabels: {
      formatter: function (val, opts) {
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
    labels: data.map((item) => item.category || "Unknown"),
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

  mergedOptions = deepMerge(mergedOptions, userOptions);

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
        type={chartType}
        height={"100%"}
      />
    </div>
  );
};

export default BaseCircularChart;
