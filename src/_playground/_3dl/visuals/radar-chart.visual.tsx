import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../visualizations/types/visual-props";
import getInfoTagContents from "../../visualizations/visual-utils/info-tag/helpers/get-info-tag-content";

const RadarChart = ({
  container: Container,
  header = "Radar Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  resize,
  children,
  DataStringQuery,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="radar" />;

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

export default RadarChart;
