import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";
import type { ContainerComponentProps } from "../types/types";

const BarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}: {
  container?: React.ComponentType<ContainerComponentProps>;
  header?: string;
  subHeader?: string;
  exportData?: string;
  detailsComponent?: string;
}) => {
  const content = <BaseXYChart {...props} chartType="bar" />;

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

export default BarChart;
