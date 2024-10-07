import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDataContext } from "../../context/DataContext";
import SearchBar from "./table-components/SearchBar";
import ColumnToggle from "./table-components/ColumnToggle";
import TableHeader from "./table-components/TableHeader";
import TableBody from "./table-components/TableBody";
import TableModal from "./table-components/TableModal";
import type { ContainerComponentProps } from "../../types/types";
import { useLayout } from "../../ui-elements/single-layout";
import TableSkeleton from "../../../ui-components/table-skeleton";

const TableContent: React.FC<{
  data: any[];
  loading: boolean;
  headers: string[];
  visibleColumns: Record<string, boolean>;
  sortState: Record<string, "ASC" | "DESC">;
  searchText: string;
  handleSearchChange: (value: string) => void;
  handleColumnToggle: (column: string) => void;
  handleSort: (column: string) => void;
  handleCellClick: (key: string, row: any) => void;
  children: React.ReactNode;
  ModalComponent?: React.ElementType;
  pageUpdater?: () => void;
  layout?: string;
  searchColumns?: string;
  pageSize?: string | number;
}> = ({
  data,
  loading,
  headers,
  visibleColumns,
  sortState,
  searchText,
  handleSearchChange,
  handleColumnToggle,
  handleSort,
  children,
  ModalComponent,
  pageUpdater,
  layout,
  searchColumns,
  pageSize,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [renderedChild, setRenderedChild] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScroll = () => {
    const table = tableRef.current;
    if (table && pageSize) {
      const { scrollTop, scrollHeight, clientHeight } = table;
      if (scrollTop + clientHeight >= scrollHeight - 1 && !loading) {
        pageUpdater?.();
      }
    }
  };

  const handleCellClickInternal = (key: string, row: any) => {
    setSelectedRowData(row);

    const matchingChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.props.columnName === key
    );

    if (matchingChild) {
      const clonedChild = React.cloneElement(
        matchingChild as React.ReactElement,
        {
          config: row,
        }
      );
      setRenderedChild(clonedChild);
    } else {
      setRenderedChild(null);
    }

    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-end space-x-4">
        {searchColumns && (
          <SearchBar
            searchText={searchText}
            handleSearchChange={handleSearchChange}
            loading={loading}
            searchColumns={searchColumns}
          />
        )}
        <ColumnToggle
          headers={headers}
          visibleColumns={visibleColumns}
          handleColumnToggle={handleColumnToggle}
        />
      </div>

      <div
        ref={tableRef}
        onScroll={handleScroll}
        className={
          layout === "single-layout"
            ? "h-[calc(100vh-280px)] overflow-y-auto"
            : "h-[500px] overflow-y-auto rounded"
        }
      >
        <table className="min-w-full table-auto border-collapse">
          <TableHeader
            headers={headers}
            visibleColumns={visibleColumns}
            sortState={sortState}
            handleSort={handleSort}
          />
          <TableBody
            data={data}
            headers={headers}
            visibleColumns={visibleColumns}
            handleCellClick={handleCellClickInternal}
          >
            {children}
          </TableBody>
        </table>
        {loading && <TableSkeleton />}
      </div>

      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ModalComponent={ModalComponent ?? (() => null)}
        renderedChild={renderedChild}
        selectedRowData={selectedRowData}
      />
    </div>
  );
};

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
  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {}
  );
  const [sortState, setSortState] = useState<Record<string, "ASC" | "DESC">>(
    {}
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
              `Column "${header}" specified in initialColumns does not exist in the table.`
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
      <div className="mt-4">
        {/* "block w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800" */}
        {content}
      </div>
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
