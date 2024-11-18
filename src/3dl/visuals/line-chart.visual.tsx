import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../types/visual-props";

const LineChart = ({
  container: Container,
  header = "Line Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  resize,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="line" />;

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

export default LineChart;
