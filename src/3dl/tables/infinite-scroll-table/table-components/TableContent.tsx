/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import TableSkeleton from "../../../../ui-components/table-skeleton";
import ColumnToggle from "./ColumnToggle";
import SearchBar from "./SearchBar";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";

const TableContent = ({
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
}: {
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

export default TableContent;
