import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { VisualProps } from "../../types/visual-props";

const DonutChart = ({
  container: Container,
  header = "Donut Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  resize,
  ...props
}: VisualProps) => {
  const content = <BaseCircularChart {...props} chartType="donut" />;

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      resize={resize}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default DonutChart;
