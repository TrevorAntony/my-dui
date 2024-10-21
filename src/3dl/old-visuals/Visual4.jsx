import React from "react";
import Chart from "react-apexcharts";
import { useDataContext } from "../context/DataContext";
import PropTypes from "prop-types"; // Add this import

// Visual4 component using data from its DataContainer
const Visual4 = ({ colors, chartType = "bar" }) => {
  const { data } = useDataContext();

  // Check if data is provided and is an array
  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>; // Handle case where data is not an array
  }

  // Extract categories and series data from static data
  const categories = data.map((item) => item.category || "Unknown");
  const seriesData = data.map((item) => item.value || 0);

  // Define the data and options for the chart
  const chartOptions = {
    chart: {
      id: "basic-chart",
    },
    xaxis: {
      categories, // Use categories from data
    },
    plotOptions: {
      bar: {
        distributed: chartType === "bar", // Distributed colors only for bar charts
      },
    },
    colors: colors || ["#00E396", "#FF4560", "#775DD0", "#FEB019"], // Default colors if none provided
    stroke: {
      curve: chartType === "line" ? "smooth" : undefined, // Smooth line only for line charts
    },
  };

  const chartSeries = [
    {
      name: "Quantity",
      data: seriesData, // Use series data from data
    },
  ];

  return (
    <div>
      <h2>
        Visual 4 - {chartType.charAt(0).toUpperCase() + chartType.slice(1)}{" "}
        Chart
      </h2>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type={chartType}
        width="500"
      />
    </div>
  );
};

// Add prop types validation
Visual4.propTypes = {
  colors: PropTypes.array.isRequired, // Assuming colors is an array
  chartType: PropTypes.string, // Validate chartType
};

export default Visual4;
