import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const PieChart = ({
  container: Container,
  header = "Pie Chart",
  subHeader = header,
  exportData,
  ...props
}) => {
  const content = <BaseCircularChart {...props} chartType="pie" />;

  return Container ? (
    <Container header={header} subHeader={subHeader} exportData={exportData}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default PieChart;
