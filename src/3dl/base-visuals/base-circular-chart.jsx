import React from "react";
import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../utilities/DataContainer";

const BaseCircularChart = ({ chartType = "pie" }) => {
  const theme = useThemeContext();
  const data = useDataContext();

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available to render the chart.</div>;
  }

  const { apex: apexOptions } = theme.themes[0];

  const chartData = {
    series: data.map((item) => item.value || 0),
    options: {
      chart: {
        type: chartType,
        id: "circular-chart",
      },
      labels: data.map((item) => item.category || "Unknown"),
      legend: {
        position: "bottom",
      },
      responsive: [
        {
          breakpoint: 768, // Adjust the breakpoint as necessary
          options: {
            chart: {
              width: "100%", // Set to 100% width below the breakpoint
            },
            legend: {
              position: "bottom",
              offsetX: 0,
              offsetY: 0,
            },
          },
        },
      ],
    },
  };

  const copiedOptions = deepCopy(apexOptions);
  let mergedOptions = deepMerge(chartData, copiedOptions);

  mergedOptions = {
    ...mergedOptions,
    options: {
      ...mergedOptions,
      colors: mergedOptions.colors,
      theme: mergedOptions.theme,
      labels: mergedOptions.options.labels,
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%", height: "auto" }}>
      <Chart
        options={mergedOptions.options}
        series={mergedOptions.series}
        type={chartType}
        height={400}
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
