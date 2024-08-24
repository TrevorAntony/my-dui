import React from "react";
import { MantineReactTable } from "mantine-react-table";
import ChartComponent from "../ui-elements/chart-component";
import { useDataContext } from "../utilities/DataContainer";

const SmartDataTable = ({
  container: ContainerComponent,
  header = "Smart Data Table",
  subHeader = header,
  ...props
}) => {
  const data = useDataContext();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  // Generate columns from data keys
  const columns = Object.keys(data[0]).map((key) => ({
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  // Content to be rendered inside the ChartComponent
  const content = (
    <div style={{ height: "400px", overflowY: "auto" }}>
      <MantineReactTable
        columns={columns}
        data={data}
        enableGlobalFilter
        enablePagination={false}
        enableRowSelection
        initialState={{ pagination: { pageSize: 10 } }}
        {...props}
      />
    </div>
  );

  // Conditionally wrap the ChartComponent in Container if provided
  return ContainerComponent ? (
    <ContainerComponent header={header} subHeader={subHeader}>
      {content}
    </ContainerComponent>
  ) : (
    content
  );
};

export default SmartDataTable;
