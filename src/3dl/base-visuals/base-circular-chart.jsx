import React from "react";
import Chart from "react-apexcharts";
import ChartComponent from "../ui-elements/chart-component";

const BaseCircularChart = ({ data, header, chartType = "pie" }) => {
  // Ensure data is an array and contains valid items
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available to render the chart.</div>;
  }

  const chartData = {
    series: data.map((item) => item.value || 0),
    options: {
      chart: {
        type: chartType,
      },
      labels: data.map((item) => item.category || "Unknown"),
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <Chart
      options={chartData.options}
      series={chartData.series}
      type={chartType}
      height={400}
    />
  );
};

export default BaseCircularChart;
