import BaseCircularChart from "../../features/visualizations/base-visuals/base-circular-chart";
import type { VisualProps } from "../../features/visualizations/types/visual-props";
import getInfoTagContents from "../../features/visualizations/visual-utils/info-tag/helpers/get-info-tag-content";

const RadialBarChart = ({
  container: Container,
  header = "Radial Bar Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  resize,
  children,
  DataStringQuery,
  ...props
}: VisualProps) => {
  // Content to be rendered
  const content = <BaseCircularChart {...props} chartType="radialBar" />;

  // Conditionally wrap the content in a Container if provided
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

export default RadialBarChart;
