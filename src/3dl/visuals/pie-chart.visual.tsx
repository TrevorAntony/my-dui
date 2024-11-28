import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";

const PieChart = ({
  container: Container,
  header = "Pie Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  resize,
  children,
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
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default PieChart;
