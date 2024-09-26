import React, { useRef, useState, useEffect } from "react";
import { useLayout } from "../ui-elements/single-layout";
import { useDataContext } from "../context/DataContext";
import { FiColumns, FiSearch, FiLoader } from "react-icons/fi";

type SortOrder = "asc" | "desc" | null;

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
    updateSortText,
  } = useDataContext();

  const layout = useLayout();
  const tableRef = useRef<HTMLDivElement>(null);

  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {}
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [lastLoadedData, setLastLoadedData] = useState<any[]>([]);
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

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const sortData = (column: string) => {
    if (sortedColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortedColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData = [...(data || [])].sort((a, b) => {
    if (!sortedColumn || !sortOrder) return 0;

    const valueA = a[sortedColumn];
    const valueB = b[sortedColumn];

    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

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
      setLastLoadedData(data);
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
            <FiColumns className="text-gray-500" />
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
        className="h-96 overflow-y-auto rounded border border-gray-300"
      >
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {headers
                ?.filter((header) => visibleColumns[header])
                .map((header) => (
                  <th
                    key={header}
                    className="sticky top-0 cursor-pointer select-none border-b border-l border-gray-300 bg-gray-100 px-4 py-2"
                    onClick={() => sortData(header)}
                  >
                    <div className="flex items-center justify-between">
                      {/* Column header text and sort button placed together */}
                      <div className="flex items-center space-x-2">
                        <span>
                          {header.charAt(0).toUpperCase() + header.slice(1)}
                        </span>

                        {/* Column sort button right next to header text */}
                        <span>
                          {sortedColumn === header ? (
                            sortOrder === "asc" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {(sortedData.length > 0 ? sortedData : lastLoadedData)?.map(
              (row) => (
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
                          className="border border-gray-300 px-4 py-2" // Removed 'text-center' class and added 'border'
                          onClick={
                            hasMatchingChild
                              ? () => handleCellClick(header, row)
                              : undefined
                          }
                          style={
                            hasMatchingChild
                              ? { cursor: "pointer", color: "blue" }
                              : {}
                          }
                        >
                          {row[header]}
                        </td>
                      );
                    })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for rendering custom content */}
      {isModalOpen && ModalComponent && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modalSize="medium"
          title={selectedRowData.name}
        >
          {renderedChild ? (
            renderedChild
          ) : (
            <div>No custom content available for this row</div>
          )}
        </ModalComponent>
      )}
    </div>
  );

  const wrappedContent =
    layout === "single-layout" ? (
      <div className="w-full">{content}</div>
    ) : ContainerComponent ? (
      <ContainerComponent
        header={header}
        subHeader={subHeader}
        variant={variant}
      >
        {content}
      </ContainerComponent>
    ) : (
      content
    );

  return wrappedContent;
};

export default InfiniteScrollTable;
