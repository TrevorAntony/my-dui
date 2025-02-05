import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../types/visual-props";
import getInfoTagContents from "../visual-utils/info-tag/helpers/get-info-tag-content";

const LineChart = ({
  container: Container,
  header = "Line Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  resize,
  children,
  DataStringQuery,
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
      infoTagContent={getInfoTagContents(children)}
      DataStringQuery={DataStringQuery}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default LineChart;
