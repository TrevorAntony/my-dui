/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useRef,
  useState,
  useDeferredValue,
  useCallback,
} from "react";
import ColumnToggle from "./ColumnToggle";
import SearchBar from "./SearchBar";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import ExportData from "../../../utilities/export-data/export-data";
import Dataset from "../../../utilities/data-set";
import useDuftQuery from "../../../../3dlcomponents/resources/useDuftQuery";
import EmptyState from "../../../ui-elements/empty-state";
import { Button, Modal } from "flowbite-react";
import { Spinner } from "flowbite-react";

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
  pageUpdater,
  layout,
  searchColumns,
  pageSize,
  exportData = "false",
  query,
  searchHint,
  detailsTitle,
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
  exportData?: string | boolean;
  query?: string;
  searchHint?: string;
  resize?: string;
  detailsTitle?: string;
}) => {
  const deferredSearchText = useDeferredValue(searchText);
  const tableRef = useRef<HTMLDivElement>(null);
  const [renderedChild, setRenderedChild] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shouldExportData = exportData === "true";

  const handleDeferredSearch = useCallback(
    (value: string) => {
      handleSearchChange(value);
    },
    [handleSearchChange]
  );
  useEffect(() => {
    handleDeferredSearch(deferredSearchText);
  }, [deferredSearchText, handleDeferredSearch]);

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
    <>
      <div className="relative">
        <div className="mb-4 flex items-center justify-end space-x-4">
          {searchColumns && (
            <SearchBar
              searchText={searchText}
              handleSearchChange={handleSearchChange}
              loading={loading}
              searchColumns={searchColumns}
              searchHint={searchHint}
            />
          )}
          <ColumnToggle
            headers={headers}
            visibleColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />
          {shouldExportData && (
            <div className={`self-start pr-1 pt-1.5`}>
              {query ? (
                <Dataset query={query} useQuery={useDuftQuery}>
                  <ExportData />
                </Dataset>
              ) : (
                <ExportData />
              )}
            </div>
          )}
        </div>

        <div
          ref={tableRef}
          onScroll={handleScroll}
          className={
            layout === "single-layout"
              ? "h-[calc(100vh-280px)] overflow-y-auto"
              : "h-[400px] overflow-y-auto rounded"
          }
        >
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <TableHeader
              headers={headers}
              visibleColumns={visibleColumns}
              sortState={sortState}
              handleSort={handleSort}
            />
            {data?.length > 0 && (
              <TableBody
                data={data}
                headers={headers}
                visibleColumns={visibleColumns}
                handleCellClick={handleCellClickInternal}
              >
                {children}
              </TableBody>
            )}
          </table>
          {loading && !data && (
            <div className="flex h-40 items-center justify-center">
              <Spinner
                size="xl"
                className="text-gray-500 dark:text-gray-300 fill-gray-600 dark:fill-gray-400"
              />
            </div>
          )}
          {!loading && !data?.length && <EmptyState />}
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        position="center"
        size="4xl"
      >
        <Modal.Header>{detailsTitle}</Modal.Header>
        <Modal.Body className="flex flex-col overflow-hidden ">
          {renderedChild}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button onClick={() => setIsModalOpen(false)} color="primary">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableContent;
