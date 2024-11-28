import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { VisualProps } from "../../types/visual-props";

const PieChart = ({
  container: Container,
  header = "Pie Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  resize,
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
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default PieChart;
