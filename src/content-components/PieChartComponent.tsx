import React from "react";
import Chart from "react-apexcharts";

type PieChartProps = {
  labels: string[];
  series: number[];
};

const PieChartComponent: React.FC<PieChartProps> = ({ labels, series }) => {
  const options = {
    labels,
    chart: {
      type: "pie",
    },
    legend: {
      position: "bottom", // Place the legend at the bottom by default
      horizontalAlign: "center", // Center the legend horizontally
      itemMargin: {
        horizontal: 10, // Add horizontal margin between legend items
        vertical: 5, // Add vertical margin for better spacing
      },
      fontSize: "14px", // Adjust font size for better readability
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom", // Keep the legend at the bottom on smaller screens
            horizontalAlign: "center",
            fontSize: "12px", // Adjust font size for smaller screens
          },
        },
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Chart options={options} series={series} type="pie" width="100%" />
    </div>
  );
};

export default PieChartComponent;
