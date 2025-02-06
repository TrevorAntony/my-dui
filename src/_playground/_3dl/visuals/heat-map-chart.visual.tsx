import BaseXYChart from "../../../features/visualizations/base-visuals/base-xy-chart";
import type { VisualProps } from "../../../features/visualizations/types/visual-props";
import getInfoTagContents from "../../../features/visualizations/visual-utils/info-tag/helpers/get-info-tag-content";

const HeatmapChart = ({
  container: Container,
  header = "Heat-map Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  children,
  resize,
  DataStringQuery,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="heatmap" />;

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      resize={resize}
      infoTagContent={getInfoTagContents(children)}
      DataStringQuery={DataStringQuery}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default HeatmapChart;
