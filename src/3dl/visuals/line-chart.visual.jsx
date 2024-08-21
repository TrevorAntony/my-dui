import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const LineChart = ({
  container: Container,
  header,
  subHeader = header,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="line" />;

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default LineChart;
