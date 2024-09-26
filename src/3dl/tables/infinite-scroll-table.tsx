import React, { useRef, useState, useEffect, useMemo } from "react";
import { useLayout } from "../ui-elements/single-layout";
import { useDataContext } from "../context/DataContext";
import {
  FiColumns,
  FiSearch,
  FiLoader,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

interface InfiniteScrollTableProps {
  container?: React.ElementType;
  header?: string;
  subHeader?: string;
  variant?: "card" | "plain" | "no-card";
  modal?: React.ElementType;
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

  const layout = useLayout();
  const tableRef = useRef<HTMLDivElement>(null);

  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {}
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [renderedChild, setRenderedChild] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sortState, setSortState] = useState<Record<string, "ASC" | "DESC">>(
    {}
  );

  const handleScroll = () => {
    const table = tableRef.current;
    if (table) {
      const { scrollTop, scrollHeight, clientHeight } = table;
      if (scrollTop + clientHeight >= scrollHeight - 1 && !loading) {
        pageUpdater?.();
      }
    }
  };

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

  // Ensure columns are visible by default when data is available
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

  const handleCellClick = (key: string, row: any) => {
    setSelectedRowData(row);

    const matchingChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.props.columnName === key
    );

    if (matchingChild) {
      const clonedChild = React.cloneElement(matchingChild, {
        config: row,
      });
      setRenderedChild(clonedChild);
    } else {
      setRenderedChild(null);
    }

    setIsModalOpen(true);
  };

  const content = (
    <div className="relative">
      {/* Search input and column toggle */}
      <div className="mb-4 flex items-center justify-end space-x-4">
        {/* Search input with icon and loading spinner */}
        <div className="relative flex-1" style={{ maxWidth: "500px" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => handleSearchChange?.(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            {loading ? (
              <FiLoader className="animate-spin text-gray-500" />
            ) : (
              <FiSearch className="text-gray-500" />
            )}
          </div>
        </div>

        {/* Column toggle icon button */}
        <div className="relative">
          <button
            className="rounded border border-gray-300 bg-gray-100 p-2 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <svg
              className="h-6 w-6 text-gray-500 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg"
              style={{ zIndex: 1000 }}
            >
              {headers.map((header) => (
                <label
                  key={header}
                  className="block cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns[header]}
                    onChange={() => handleColumnToggle(header)}
                    className="mr-2"
                  />
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable table */}
      <div
        ref={tableRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-auto rounded"
      >
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {headers
                ?.filter((header) => visibleColumns[header])
                .map((header) => (
                  <th
                    key={header}
                    className="sticky top-0 cursor-pointer select-none bg-gray-100 px-4 py-2  text-gray-500 hover:text-gray-900"
                    onClick={() => handleSort(header)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>
                          {header.charAt(0).toUpperCase() + header.slice(1)}
                        </span>
                        <span>
                          {sortState[header] === "ASC" ? (
                            <FiChevronUp className="h-4 w-4 text-gray-600" />
                          ) : (
                            <FiChevronDown className="h-4 w-4 text-gray-600" />
                          )}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {sortedData?.map((row) => (
              <tr key={row.id}>
                {headers
                  ?.filter((header) => visibleColumns[header])
                  .map((header) => {
                    const hasMatchingChild = React.Children.toArray(
                      children
                    ).some(
                      (child) =>
                        React.isValidElement(child) &&
                        child.props.columnName === header
                    );
                    return (
                      <td
                        key={`${row.id}-${header}`}
                        className="border-b border-gray-300 p-4"
                        onClick={
                          hasMatchingChild
                            ? () => handleCellClick(header, row)
                            : undefined
                        }
                        style={{
                          cursor: hasMatchingChild ? "pointer" : "default",
                          textDecoration: hasMatchingChild
                            ? "underline"
                            : "none",
                        }}
                      >
                        {row[header]}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="flex justify-center py-4">
            <FiLoader className="animate-spin text-gray-500" />
          </div>
        )}
      </div>

      {/* Modal rendering */}
      {isModalOpen && ModalComponent && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          {renderedChild ? renderedChild : selectedRowData}
        </ModalComponent>
      )}
    </div>
  );

  return ContainerComponent ? (
    <ContainerComponent header={header} subHeader={subHeader} variant={variant}>
      {content}
    </ContainerComponent>
  ) : (
    content
  );
};

export default InfiniteScrollTable;
