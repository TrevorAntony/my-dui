import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";
const BarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  children,
  resize,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="bar" />;

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

export default BarChart;
