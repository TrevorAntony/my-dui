import React from "react";
import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../utilities/DataContainer";

const BaseCircularChart = ({ chartType = "pie", userOptions }) => {
  const theme = useThemeContext();
  const data = useDataContext();

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available to render the chart.</div>;
  }

  const { apex: apexOptions } = theme.themes[0];

  const chartData = {
    series: data.map((item) => item.value || 0),
    labels: data.map((item) => item.category || "Unknown"),
    chart: {
      type: chartType,
      id: "circular-chart",
    },
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 768,
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

  const copiedOptions = deepCopy(apexOptions);
  let mergedOptions = deepMerge(chartData, copiedOptions);
  mergedOptions = deepMerge(mergedOptions, userOptions);

  return (
    <div style={{ width: "100%", maxWidth: "100%", height: "auto" }}>
      <Chart
        options={mergedOptions}
        series={mergedOptions.series}
        type={chartType}
        height="auto"
      />
    </div>
  );
};

export default BaseCircularChart;

function deepCopy(obj) {
  if (!obj) return {};
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}
