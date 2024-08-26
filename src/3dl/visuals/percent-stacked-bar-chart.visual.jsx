import React from "react";
import Chart from "react-apexcharts";
import ChartComponent from "../ui-elements/chart-component";
import { useDataContext } from "../utilities/DataContainer";

const PercentStackedBarChart = ({ header, colors, isHorizontal }) => {
  const data = useDataContext();

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  // Get the category column label
  const categoryColumn = Object.keys(data[0])[0];
  // Extract categories and series data from the rectangular data
  const categories = data.map((item) => item[categoryColumn]);

  // Prepare series data
  const series = Object.keys(data[0] || {})
    .filter((key) => key !== categoryColumn)
    .map((key) => {
      return {
        name: key,
        data: data.map((item) => item[key]),
      };
    });

  // Chart options
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: isHorizontal || false,
        borderRadius: 5, // Optional: adds a border radius to the bars
      },
    },
    xaxis: {
      categories: categories || [], // Use provided categories or default to empty array
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val) => `${val}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    legend: {
      show: true,
      position: "top", // Position legend on top of the chart
    },
    fill: {
      opacity: 1,
    },
    colors: colors || ["#00E396", "#FF4560", "#775DD0", "#FEB019"], // Default colors if none provided
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"], // White line between stacked bars
    },
    title: {
      text: header || "Chart Title", // Adding the header as title
      align: "left",
    },
  };

  return (
    <div>
      <ChartComponent header={header}>
        <Chart options={chartOptions} series={series} type="bar" width="500" />
      </ChartComponent>
    </div>
  );
};

export default PercentStackedBarChart;
