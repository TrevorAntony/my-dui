import React from "react";
import { useDataContext } from "../context/DataContext";
import { useLayout } from "../ui-elements/single-layout";

// Define types for props and data
interface DataTableProps {
  container?: React.ComponentType<{
    header: string;
    subHeader?: string;
    variant?: string;
    children: React.ReactNode;
  }>;
  header: string;
  subHeader?: string;
  variant?: string;
  exportData?: boolean | string;
}

const DataTable: React.FC<DataTableProps> = ({
  container: ContainerComponent,
  header,
  subHeader = "",
  variant = "card",
  exportData,
}) => {
  const { data } = useDataContext();
  const layout = useLayout();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(data[0]);

  const content = (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                backgroundColor: "#f2f2f2",
              }}
            >
              {header.charAt(0).toUpperCase() + header.slice(1)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td
                key={header}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                {item[header]}
              </td>
            ))}
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

  return ContainerComponent && layout !== "single-layout" ? (
    <ContainerComponent
      header={header}
      subHeader={subHeader}
      variant={variant}
      exportData={exportData}
    >
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default DataTable;
