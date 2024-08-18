import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const BarChart = (props) => {
  return <BaseXYChart {...props} chartType="bar" />;
};

export default BarChart;
