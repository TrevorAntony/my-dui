import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../types/visual-props";
const BarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  resize,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="bar" />;

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

export default BarChart;
