import React from "react";
import Chart from "react-apexcharts";

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

  return (
    <div style={{ width: "100%", maxWidth: "100%", height: "auto" }}>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type={chartType}
        height={400}
      />
    </div>
  );
};

export default BaseCircularChart;
