/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDataContext } from "../../context/DataContext";
import type { ContainerComponentProps } from "../../types/types";
import { useLayout } from "../../ui-elements/single-layout";
import TableContent from "./table-components/TableContent";

interface InfiniteScrollTableProps {
  container: React.ComponentType<ContainerComponentProps>;
  header?: string;
  subHeader?: string;
  variant?: "card" | "default";
  modal: React.ComponentType<unknown>;
  children?: React.ReactNode;
  exportData?: boolean | string;
  initialColumns?: string;
  detailsComponent?: string;
}

const InfiniteScrollTable: React.FC<InfiniteScrollTableProps> = ({
  container: ContainerComponent,
  header,
  subHeader = "",
  variant = "card",
  modal: ModalComponent,
  children,
  exportData,
  initialColumns,
  detailsComponent,
}) => {
  const {
    data,
    loading,
    pageUpdater,
    searchText,
    handleSearchChange,
    handleSortChange,
    query,
    searchColumns,
    pageSize,
  } = useDataContext();

  const layout = useLayout();

  const headers = useMemo(() => {
    return data?.length > 0 ? Object.keys(data[0]) : [];
  }, [data]);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {},
  );
  const [sortState, setSortState] = useState<Record<string, "ASC" | "DESC">>(
    {},
  );
  const initializedRef = useRef(false);

  useEffect(() => {
    if (data?.length > 0 && !initializedRef.current) {
      const initialVisibility: Record<string, boolean> = {};
      const initialColumnsList = initialColumns
        ? initialColumns.split(",").map((col) => col.trim())
        : [];

      headers.forEach((header) => {
        if (initialColumnsList.length === 0) {
          // If no initialColumns provided, show all columns
          initialVisibility[header] = true;
        } else {
          initialVisibility[header] = initialColumnsList.includes(header);
          if (
            initialColumnsList.includes(header) &&
            !headers.includes(header)
          ) {
            console.error(
              `Column "${header}" specified in initialColumns does not exist in the table.`,
            );
          }
        }
      });

      setVisibleColumns((prevVisibleColumns) => ({
        ...initialVisibility,
        ...prevVisibleColumns,
      }));
      initializedRef.current = true;
    }
  }, [data, initialColumns, headers]);

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleSort = (column: string) => {
    const currentSort = sortState[column] || "ASC";
    const newSort = currentSort === "ASC" ? "DESC" : "ASC";
    const sortKey = `${column} ${newSort}`;

    setSortState({ [column]: newSort });

    handleSortChange?.(sortKey);
  };

  const sortedData = useMemo(() => {
    return data;
  }, [data]);

  const content = (
    <TableContent
      data={sortedData}
      loading={loading as boolean}
      headers={headers}
      visibleColumns={visibleColumns}
      sortState={sortState}
      searchText={searchText as string}
      handleSearchChange={handleSearchChange as (value: string) => void}
      handleColumnToggle={handleColumnToggle}
      handleSort={handleSort}
      handleCellClick={() => {}}
      ModalComponent={ModalComponent}
      pageUpdater={pageUpdater}
      layout={layout}
      searchColumns={searchColumns}
      pageSize={pageSize}
    >
      {children}
    </TableContent>
  );

  const wrappedContent =
    layout === "single-layout" ? (
      <div className="mt-4">{content}</div>
    ) : (
      content
    );

  return ContainerComponent && layout !== "single-layout" ? (
    <ContainerComponent
      header={header as string}
      subHeader={subHeader as string}
      variant={variant as "card" | "default"}
      query={query}
      exportData={exportData}
      detailsComponent={detailsComponent as string}
    >
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default InfiniteScrollTable;
