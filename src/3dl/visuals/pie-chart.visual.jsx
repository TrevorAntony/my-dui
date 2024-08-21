import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const PieChart = ({
  container: Container,
  header,
  subHeader = header,
  ...props
}) => {
  const content = <BaseCircularChart {...props} chartType="pie" />;

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default PieChart;
