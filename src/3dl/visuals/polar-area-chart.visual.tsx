import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { ContainerComponentProps } from "../types/types";

const PolarAreaChart = ({
  container: Container,
  header = "Polar Area Chart",
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
  userOptions?: Record<string, unknown>;
}) => {
  const content = <BaseCircularChart {...props} chartType="polarArea" />;

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

export default PolarAreaChart;
