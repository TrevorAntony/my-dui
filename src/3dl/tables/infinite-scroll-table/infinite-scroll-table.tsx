import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDataContext } from "../../context/DataContext";
import SearchBar from "./table-components/SearchBar";
import ColumnToggle from "./table-components/ColumnToggle";
import TableHeader from "./table-components/TableHeader";
import TableBody from "./table-components/TableBody";
import TableModal from "./table-components/TableModal";
import { FiLoader } from "react-icons/fi";
import type { ContainerComponentProps } from "../../types/types";

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
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [renderedChild, setRenderedChild] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScroll = () => {
    const table = tableRef.current;
    if (table) {
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
        <SearchBar
          searchText={searchText}
          handleSearchChange={handleSearchChange}
          loading={loading}
        />
        <ColumnToggle
          headers={headers}
          visibleColumns={visibleColumns}
          handleColumnToggle={handleColumnToggle}
        />
      </div>

      <div
        ref={tableRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-auto rounded"
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
        {loading && (
          <div className="flex justify-center py-4">
            <FiLoader className="animate-spin text-gray-500" />
          </div>
        )}
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
}

const InfiniteScrollTable: React.FC<InfiniteScrollTableProps> = ({
  container: ContainerComponent,
  header,
  subHeader = "",
  variant = "card",
  modal: ModalComponent,
  children,
}) => {
  const {
    data,
    loading,
    pageUpdater,
    searchText,
    handleSearchChange,
    handleSortChange,
  } = useDataContext();

  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {}
  );
  const [sortState, setSortState] = useState<Record<string, "ASC" | "DESC">>(
    {}
  );

  useEffect(() => {
    if (data?.length > 0) {
      const initialVisibility = headers.reduce(
        (acc, header) => {
          acc[header] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );
      setVisibleColumns(initialVisibility);
    }
  }, [data]);

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

    setSortState((prev) => ({
      ...prev,
      [column]: newSort,
    }));

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
    >
      {children}
    </TableContent>
  );

  return ContainerComponent ? (
    <ContainerComponent
      header={header as string}
      subHeader={subHeader as string}
      variant={variant as "card" | "default"}
    >
      {content}
    </ContainerComponent>
  ) : (
    content
  );
};

export default InfiniteScrollTable;
