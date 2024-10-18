import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { ContainerComponentProps } from "../types/types";

const RadialBarChart = ({
  container: Container,
  header = "Radial Bar Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}: {
  container: React.ComponentType<ContainerComponentProps>;
  header: string;
  subHeader: string;
  exportData: string;
  detailsComponent: string;
  userOptions?: Record<string, unknown>;
}) => {
  // Content to be rendered
  const content = <BaseCircularChart {...props} chartType="radialBar" />;

  // Conditionally wrap the content in a Container if provided
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

export default RadialBarChart;
