/* eslint-disable @typescript-eslint/no-explicit-any */

import { MantineReactTable } from "mantine-react-table";
import { Box } from "@mantine/core";
import { useDataContext } from "../context/DataContext";
import { useLayout } from "../utilities/Dashboard";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";
import EmptyState from "../ui-elements/empty-state";
import ChartSkeleton from "../../ui-components/chart-skeleton";

const ScoreCardTable = ({
  container: ContainerComponent,
  header = "Score Card Table",
  subHeader = header,
  tableMaxHeight = "300px",
  showToolbar,
  exportData,
  detailsComponent,
  resize = "false",
  children,
  ...props
}: VisualProps) => {
  const { data, loading } = useDataContext();
  const layout = useLayout();
  if (loading) {
    return <ChartSkeleton />;
  }

  if (!loading && Array.isArray(data) && data.length === 0) {
    const content = (
      <EmptyState message="No data available for score card table" />
    );
    return ContainerComponent ? (
      <ContainerComponent header={""} {...props}>
        {content}
      </ContainerComponent>
    ) : (
      content
    );
  }
  if (!data) {
    return null;
  }

  const columns = Object.keys(data[0])
    .filter((key) => key !== "color")
    .map((key) => {
      if (key === "score") {
        return {
          accessorKey: key,
          header: "Score",
          size: 150,
          mantineTableHeadCellProps: {
            align: "right" as const,
          },
          mantineTableBodyCellProps: {
            align: "right" as const,
          },
          Cell: ({ row }: { row: Record<string, any> }) => {
            const score = row["original"]?.score / 100;
            const color = row["original"]?.color;

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
          mantineTableHeadCellProps: { align: "left" as const },
          mantineTableBodyCellProps: { align: "left" as const },
        };
      }
    });

  const content = (
    <MantineReactTable
      columns={columns}
      enableStickyHeader
      enableTopToolbar={Boolean(showToolbar)}
      enableBottomToolbar={Boolean(showToolbar)}
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
    <ContainerComponent
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      resize={resize}
      infoTagContent={getInfoTagContents(children)}
    >
      {content}
    </ContainerComponent>
  ) : (
    content
  );
};

export default ScoreCardTable;
