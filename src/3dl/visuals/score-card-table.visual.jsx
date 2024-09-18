import React from "react";
import { MantineReactTable } from "mantine-react-table";
import { Box } from "@mantine/core";
import { useDataContext } from "../context/DataContext";
import { useLayout } from "../utilities/Dashboard";

const ScoreCardTable = ({
  container: ContainerComponent,
  header = "Score Card Table",
  subHeader = header,
  tableMaxHeight = "300px",
  showToolbar,
  ...props
}) => {
  const { data } = useDataContext();
  const layout = useLayout();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  // Generate columns, filtering out the 'color' column
  const columns = Object.keys(data[0])
    .filter((key) => key !== "color") // Exclude the 'color' column
    .map((key) => {
      if (key === "score") {
        return {
          accessorKey: key,
          header: "Score",
          size: 150,
          mantineTableHeadCellProps: {
            align: "right",
          },
          mantineTableBodyCellProps: {
            align: "right",
          },
          Cell: ({ row }) => {
            const score = row.original.score / 100; // Convert score to a percentage
            const color = row.original.color;

            // Set background color based on the color attribute
            let backgroundColor;
            switch (color) {
              case "Bad":
                backgroundColor = "#EA3323"; // Red
                break;
              case "Good":
                backgroundColor = "#7DAB56"; // Green
                break;
              case "Average":
                backgroundColor = "#F5C242"; // Yellow
                break;
              default:
                backgroundColor = "#FFFFFF"; // Default to white if no match
                break;
            }

            return (
              <Box
                sx={{
                  backgroundColor,
                  borderRadius: "4px",
                  color: "#000",
                  maxWidth: "9ch",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {score?.toLocaleString?.("en-US", {
                  style: "percent",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            );
          },
        };
      } else {
        return {
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
          size: 150,
        };
      }
    });

  const content = (
    <MantineReactTable
      columns={columns}
      enableStickyHeader
      enableTopToolbar={showToolbar}
      enableBottomToolbar={showToolbar}
      data={data}
      enableGlobalFilter={false}
      enablePagination={false}
      enableRowSelection={false}
      enableColumnFilterModes={true}
      enableColumnOrdering={true}
      enableFacetedValues={true}
      mantineTableContainerProps={{ sx: { maxHeight: tableMaxHeight } }}
      {...props}
    />
  );

  return layout === "single-layout" ? (
    content
  ) : ContainerComponent ? (
    <ContainerComponent header={header} subHeader={subHeader}>
      {content}
    </ContainerComponent>
  ) : (
    content
  );
};

export default ScoreCardTable;
