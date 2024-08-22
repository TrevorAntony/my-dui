import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const RadarChart = ({
  container: Container,
  header = "Radar Chart",
  subHeader = header,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="radar" />;

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default RadarChart;
