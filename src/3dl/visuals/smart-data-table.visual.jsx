import React from "react";
import { MantineReactTable } from "mantine-react-table";
import { useDataContext } from "../utilities/DataContainer";
import { useLayout } from "../utilities/Dashboard";

const SmartDataTable = ({
  container: ContainerComponent,
  header = "Smart Data Table",
  subHeader = header,
  variant = "card", // Default to "card" variant
  ...props
}) => {
  const data = useDataContext();
  const layout = useLayout();

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
    <div
      style={{
        height: "auto",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        width: layout === "single-layout" ? "100%" : "auto", // Full width if single-layout
      }}
    >
      <MantineReactTable
        columns={columns}
        enableStickyHeader
        data={data}
        enableGlobalFilter
        enablePagination={false}
        enableRowSelection
        initialState={{ pagination: { pageSize: 10 } }}
        {...props}
      />
    </div>
  );

  // Wrap the content based on the variant and layout
  const wrappedContent =
    layout === "single-layout" ? (
      <div className="block w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        {content}
      </div>
    ) : (
      content
    );

  // Conditionally wrap the ChartComponent in ContainerComponent if provided
  return ContainerComponent && layout !== "single-layout" ? (
    <ContainerComponent header={header} subHeader={subHeader} variant={variant}>
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default SmartDataTable;
