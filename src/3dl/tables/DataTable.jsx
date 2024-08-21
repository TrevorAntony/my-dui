import React from "react";

const DataTable = ({
  container: ContainerComponent,
  header = "Data Table",
  subHeader = header,
  data,
}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  // Get table headers from the keys of the first data object
  const headers = Object.keys(data[0]);

  // Content to be rendered inside the ChartComponent
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

  // Wrap the content in ChartComponent
  const wrappedContent = <>{content}</>;

  // Conditionally wrap the ChartComponent in Container if provided
  return ContainerComponent ? (
    <ContainerComponent header={header} subHeader={subHeader}>
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default DataTable;
