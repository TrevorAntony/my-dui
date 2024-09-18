import React from "react";
import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard"; // Importing the theme context
import { useDataContext } from "../context/DataContext";
import { deepCopy, deepMerge } from "../../helpers/visual-helpers"; // Importing deepCopy and deepMerge

const PercentStackedBarChart = ({
  container: Container,
  header,
  subHeader = "",
  ...props
}) => {
  const theme = useThemeContext(); // Accessing the theme context
  const { data } = useDataContext();

  if (!data || !Array.isArray(data) || !data.length) {
    return <div>No data available</div>;
  }

  // Extract categories
  const categories = data.map((item) => item.category);

  // Extract series data
  const seriesNames = Object?.keys(data[0]).filter((key) => key !== "category");
  const series = seriesNames.map((name) => ({
    name,
    data: data.map((item) => item[name]),
  }));

  const { apex: apexOptions } = theme.themes[0];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%", // Setting the stack type to 100%
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
      },
    },
    colors: ["#00E396", "#FF4560", "#775DD0", "#FEB019"],
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
    responsive: [
      {
        breakpoint: 1000, // Adjust the breakpoint as necessary
        options: {
          chart: {
            width: "100%", // Set to 100% width below the breakpoint
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
    },
  };

  const copiedOptions = deepCopy(apexOptions);
  let mergedOptions = deepMerge(options, copiedOptions);

  const content = (
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
        series={series}
        type="bar"
        height={"100%"}
      />
    </div>
  );

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default PercentStackedBarChart;
