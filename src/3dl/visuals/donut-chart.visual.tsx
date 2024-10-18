import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { ContainerComponentProps } from "../types/types";

const DonutChart = ({
  container: Container,
  header = "Donut Chart",
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
}) => {
  const content = <BaseCircularChart {...props} chartType="donut" />;

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

export default DonutChart;
