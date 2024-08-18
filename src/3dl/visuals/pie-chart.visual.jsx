import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const PieChart = (props) => {
  return <BaseCircularChart {...props} chartType="pie" />;
};

export default PieChart;
