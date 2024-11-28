import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";

const AreaChart = ({
  container: Container,
  header = "Area Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  resize,
  children,
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
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default AreaChart;
