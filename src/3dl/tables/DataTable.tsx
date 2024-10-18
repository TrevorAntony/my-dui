import React from "react";
import { useDataContext } from "../context/DataContext";
import { useLayout } from "../ui-elements/single-layout";
import TableSkeleton from "../../ui-components/table-skeleton";

// Define types for props and data
interface DataTableProps {
  container?: React.ElementType;
  header?: string;
  subHeader?: string;
  variant?: string;
  exportData?: boolean | string;
  detailsComponent?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  container: ContainerComponent,
  header,
  subHeader = "",
  variant = "card",
  exportData,
  detailsComponent,
}) => {
  const { data } = useDataContext();
  const layout = useLayout();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <TableSkeleton />;
  }

  const headers = Object.keys(data[0]);

  const content = (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead className="rounded-t-lg bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th
              key={header}
              className={`sticky top-0 cursor-pointer select-none bg-gray-100 px-4 py-2 text-left text-gray-500 hover:text-gray-900 ${
                index === 0
                  ? "rounded-tl-lg"
                  : index === headers.length - 1
                  ? "rounded-tr-lg"
                  : ""
              }`}
            >
              <div className="flex items-center justify-start space-x-2">
                <span>{header.charAt(0).toUpperCase() + header.slice(1)}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => {
              return (
                <td
                  key={`${rowIndex}-${header}`}
                  className="border-b border-gray-300 p-4"
                  style={{
                    cursor: "default",
                    textDecoration: "none",
                  }}
                >
                  {row[header]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const wrappedContent =
    layout === "single-layout" ? (
      <div className="mt-4">
        {/* "block w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800" */}
        {content}
      </div>
    ) : (
      content
    );

  return ContainerComponent ? (
    <ContainerComponent
      header={header as string}
      subHeader={subHeader}
      variant={variant}
      exportData={exportData as string}
      detailsComponent={detailsComponent as string}
    >
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default DataTable;
