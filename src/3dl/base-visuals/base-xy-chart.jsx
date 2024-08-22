import React from "react";
import Chart from "react-apexcharts";
import ChartComponent from "../ui-elements/chart-component";

// BaseXYChart component that accepts chartType as a prop
const BaseXYChart = ({ header, data, colors, chartType = "bar" }) => {
  // Check if data is provided and is an array
  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>; // Handle case where data is not an array
  }

  const isMultiSeries = typeof data[0] === "object" && !("value" in data[0]);

  let categories, chartSeries;

  if (isMultiSeries) {
    // For stacked/multi-series bar chart
    categories = data.map((item) => item.category || "Unknown");

    const seriesKeys = Object.keys(data[0]).filter((key) => key !== "category");
    chartSeries = seriesKeys.map((key) => ({
      name: key,
      data: data.map((item) => item[key] || 0),
    }));
  } else {
    // For single-series bar chart
    categories = data.map((item) => item.category || "Unknown");
    const seriesData = data.map((item) => item.value || 0);

    chartSeries = [
      {
        name: "Quantity",
        data: seriesData, // Use series data from data
      },
    ];
  }

  // Define the data and options for the chart
  const chartOptions = {
    chart: {
      id: "basic-chart",
      stacked: isMultiSeries, // Enable stacking if it's a multi-series data
    },
    xaxis: {
      categories, // Use categories from data
    },
    plotOptions: {
      bar: {
        horizontal: false, // Set to true if you want horizontal bars
        distributed: !isMultiSeries, // Distributed colors only for single series
        borderRadius: 5, // Optional: adds a border radius to the bars
      },
    },
    colors: colors || ["#00E396", "#FF4560", "#775DD0", "#FEB019"], // Default colors if none provided
    stroke: {
      show: true,
      width: isMultiSeries ? 1 : 2,
      colors: isMultiSeries ? ["#fff"] : undefined, // White line between stacked bars
    },
    legend: {
      position: "top", // Position legend on top of the chart
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`, // Optional: Format the tooltip values
      },
    },
  };

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type={chartType}
      width="500"
    />
  );
};

export default BaseXYChart;
