import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const RadarChart = (props) => {
  return <BaseXYChart {...props} chartType="radar" />;
};

export default RadarChart;
