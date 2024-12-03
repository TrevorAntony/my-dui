/* eslint-disable @typescript-eslint/no-explicit-any */
// TO:DO add data interface for this file
import type { FC } from "react";
import { useState, useEffect } from "react";
import type { PivotTableUIProps } from "react-pivottable/PivotTableUI";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useDataContext } from "../context/DataContext";
import TableSkeleton from "../../ui-components/table-skeleton";

interface PivotTableProps {
  container?: React.ElementType;
  header?: string;
  subHeader?: string;
  variant?: "card" | "no-card" | "plain";
  pivotRows?: string[];
  pivotCols?: string[];
  exportData?: string;
  detailsComponent?: React.ReactNode;
  resize?: string;
}

const PivotTable: FC<PivotTableProps> = ({
  container: ContainerComponent,
  header = "Pivot Table",
  subHeader = header,
  variant = "card",
  pivotRows = [],
  pivotCols = [],
  exportData,
  detailsComponent,
  resize = "false",
}) => {
  const initialPivotRows = pivotRows;
  const initialPivotCols = pivotCols;

  type PivotState = {
    data: any[];
    rows: string[];
    cols: string[];
  };

  const [pivotState, setPivotState] = useState<PivotState>({
    data: [],
    rows: initialPivotRows,
    cols: initialPivotCols,
  });

  const { data } = useDataContext();

  const hasValidData = data && Array.isArray(data) && data.length > 0;

  useEffect(() => {
    if (hasValidData) {
      const keys = Object.keys(data[0]);

      const activePivotRows =
        initialPivotRows.length > 0 ? initialPivotRows : [keys[0]];

      const validPivotRows = activePivotRows.filter(Boolean) as string[];

      const activePivotCols =
        initialPivotCols.length > 0 ? initialPivotCols : keys.slice(1, 6);

      setPivotState((prevState: PivotState) => {
        if (
          prevState.data !== data ||
          JSON.stringify(prevState.rows) !== JSON.stringify(validPivotRows) ||
          JSON.stringify(prevState.cols) !== JSON.stringify(activePivotCols)
        ) {
          return {
            data: data,
            rows: validPivotRows,
            cols: activePivotCols,
          };
        }
        return prevState;
      });
    }
  }, [data, initialPivotRows, initialPivotCols, hasValidData]);

  const content = hasValidData ? (
    <div>
      <PivotTableUI
        {...pivotState}
        onChange={(e: PivotTableUIProps) => setPivotState(e as PivotState)}
      />
    </div>
  ) : (
    <TableSkeleton />
  );

  const wrappedContent =
    variant === "plain" ? (
      content
    ) : (
      <div
        className={`p-4 ${variant === "card" ? "rounded border shadow" : ""}`}
      >
        {content}
      </div>
    );

  return ContainerComponent ? (
    <ContainerComponent
      header={header}
      subHeader={subHeader}
      variant={variant}
      exportData={exportData}
      detailsComponent={detailsComponent}
      resize={resize}
    >
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default PivotTable;
