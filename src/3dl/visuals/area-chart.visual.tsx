import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../types/visual-props";

const AreaChart = ({
  container: Container,
  header = "Area Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="area" />;

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

export default AreaChart;
