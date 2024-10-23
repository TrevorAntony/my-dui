import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../types/visual-props";

const HeatmapChart = ({
  container: Container,
  header = "Heat-map Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="heatmap" />;

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

export default HeatmapChart;
