import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const RadialBarChart = (props) => {
  return <BaseCircularChart {...props} chartType="radialBar" />;
};

export default RadialBarChart;
