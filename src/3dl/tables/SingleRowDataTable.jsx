import React from "react";
import { useDataContext, DataProvider } from "../context/DataContext";
import { useLayout } from "../ui-elements/single-layout";
import DataTable from "./DataTable";

const SingleRowDataTable = ({
  container: ContainerComponent,
  header,
  subHeader = "",
  variant = "plain",
}) => {
  const { data } = useDataContext();
  const layout = useLayout();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const content = (
    <DataProvider value={{ data }}>
      <DataTable variant={variant} />
    </DataProvider>
  );

  const wrappedContent =
    layout === "single-layout" ? (
      <div>
        {content}
      </div>
    ) : (
      content
    );

  return ContainerComponent && layout !== "single-layout" ? (
    <ContainerComponent header={header} subHeader={subHeader} variant={variant}>
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default SingleRowDataTable;