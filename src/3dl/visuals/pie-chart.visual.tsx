import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";

const PieChart = ({
  container: Container,
  header = "Pie Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  resize,
  children,
  DataStringQuery,
  ...props
}: VisualProps) => {
  const content = <BaseCircularChart {...props} chartType="pie" />;

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

export default PieChart;
