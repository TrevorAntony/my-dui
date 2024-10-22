import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { VisualProps } from "../../types/visual-props";

const PieChart = ({
  container: Container,
  header = "Pie Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}: VisualProps) => {
  const content = <BaseCircularChart {...props} chartType="pie" />;

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default PieChart;
