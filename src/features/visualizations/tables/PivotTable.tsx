/* eslint-disable @typescript-eslint/no-explicit-any */
// TO:DO add data interface for this file
import type { FC } from "react";
import { useState, useMemo } from "react";
import type { PivotTableUIProps } from "react-pivottable/PivotTableUI";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useDataContext } from "../../../core/context/DataContext";
import TableSkeleton from "../visual-utils/loading-skeleton/table-skeleton";

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
  DataStringQuery?: string;
}

type PivotState = {
  data: any[];
  rows: string[];
  cols: string[];
};

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
  DataStringQuery,
}) => {
  const { data } = useDataContext();
  const hasValidData = data && Array.isArray(data) && data.length > 0;

  const defaultPivotRows = useMemo(() => {
    if (!hasValidData || pivotRows.length > 0) return pivotRows;
    const keys = Object.keys(data[0]);
    return [keys[0]];
  }, [data, pivotRows, hasValidData]);

  const defaultPivotCols = useMemo(() => {
    if (!hasValidData || pivotCols.length > 0) return pivotCols;
    const keys = Object.keys(data[0]);
    return keys.slice(1, 6);
  }, [data, pivotCols, hasValidData]);

  const processedData = useMemo(() => {
    if (!hasValidData) return [];
    const keys = Object.keys(data[0]);
    const rows = data.map((row) => keys.map((key) => row[key]));
    return [keys, ...rows];
  }, [data, hasValidData]);

  const [pivotState, setPivotState] = useState<PivotState>({
    data: processedData,
    rows: defaultPivotRows,
    cols: defaultPivotCols,
  });

  if (
    pivotState.data !== processedData ||
    JSON.stringify(pivotState.rows) !== JSON.stringify(defaultPivotRows) ||
    JSON.stringify(pivotState.cols) !== JSON.stringify(defaultPivotCols)
  ) {
    setPivotState({
      data: processedData,
      rows: defaultPivotRows,
      cols: defaultPivotCols,
    });
  }

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
      DataStringQuery={DataStringQuery}
    >
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default PivotTable;
