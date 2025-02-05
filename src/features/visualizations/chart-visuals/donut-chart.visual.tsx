import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { VisualProps } from "../types/visual-props";
import getInfoTagContents from "../visual-utils/info-tag/helpers/get-info-tag-content";

const DonutChart = ({
  container: Container,
  header = "Donut Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  resize,
  children,
  DataStringQuery,
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
      infoTagContent={getInfoTagContents(children)}
      DataStringQuery={DataStringQuery}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default DonutChart;
