import BaseCircularChart from "../base-visuals/base-circular-chart";
import type { VisualProps } from "../../types/visual-props";

const PolarAreaChart = ({
  container: Container,
  header = "Polar Area Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  resize,
  children,
  ...props
}: VisualProps) => {
  const content = <BaseCircularChart {...props} chartType="polarArea" />;

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      resize={resize}
      infoTagContent={children}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default PolarAreaChart;
