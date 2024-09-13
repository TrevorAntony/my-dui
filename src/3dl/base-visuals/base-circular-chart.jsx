import React from "react";
import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../utilities/DataSet";
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
    options: {
      chart: {
        type: chartType,
        id: "circular-chart",
      },
      dataLabels: {
        formatter: function (val, opts) {
          const label = opts.w.globals.labels[opts.seriesIndex];
          const percentage = val.toFixed(1) + "%"; // Format the percentage to 1 decimal place
          return `${label})`; // Concatenate the label and percentage
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
          breakpoint: 1000, // Adjust the breakpoint as necessary, similar to BaseXYChart
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

  // Preserve specific options and merge with userOptions
  mergedOptions = {
    ...mergedOptions,
    options: {
      ...mergedOptions.options,
      colors: mergedOptions.colors,
      theme: mergedOptions.theme,
      labels: mergedOptions.options.labels,
    },
  };

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
        options={mergedOptions.options}
        series={mergedOptions.series}
        type={chartType}
        height={"100%"}
      />
    </div>
  );
};

export default BaseCircularChart;
