import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const DonutChart = (props) => {
  return <BaseCircularChart {...props} chartType="donut" />;
};

export default DonutChart;
