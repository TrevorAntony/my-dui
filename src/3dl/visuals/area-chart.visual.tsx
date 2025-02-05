import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../features/visualizations/types/visual-props";
import getInfoTagContents from "../../features/visualizations/visual-utils/info-tag/helpers/get-info-tag-content";

const AreaChart = ({
  container: Container,
  header = "Area Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  resize,
  children,
  DataStringQuery,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="area" />;

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

export default AreaChart;
