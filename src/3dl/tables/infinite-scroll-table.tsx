import React, { useRef, useState, useEffect } from "react";
import { useDataContext } from "../context/DataContext";

type SortOrder = "asc" | "desc" | null;

const InfiniteScrollTable: React.FC = () => {
  const { data, loading, pageUpdater, searchText, handleSearchChange } =
    useDataContext();

  const tableRef = useRef<HTMLDivElement>(null);

  const headers = data?.length > 0 ? Object.keys(data[0]) : [];
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {}
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleScroll = () => {
    const table = tableRef.current;
    if (table) {
      const { scrollTop, scrollHeight, clientHeight } = table;
      if (scrollTop + clientHeight >= scrollHeight - 1 && !loading) {
        pageUpdater();
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
          acc[header] = true; // Set columns as visible by default
          return acc;
        },
        {} as Record<string, boolean>
      );
      setVisibleColumns(initialVisibility);
    }
  }, [data]);

  return (
    <div className="relative">
      {/* Search input and column toggle */}
      <div className="mb-4 flex items-center justify-between space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearchChange?.(e.target.value)}
          className="flex-1 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Column toggle dropdown */}
        <div className="relative">
          <button
            className="h-full rounded border border-gray-300 bg-gray-100 px-4 py-2 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{ height: "40px" }}
          >
            Toggle Columns
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
                    className="sticky top-0 cursor-pointer select-none border-b border-gray-300 bg-gray-100 px-4 py-2 text-center"
                    onClick={() => sortData(header)}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>
                        {header.charAt(0).toUpperCase() + header.slice(1)}
                      </span>
                      <span>
                        {/* Always show chevrons for sorting */}
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
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((row) => (
              <tr key={row.id}>
                {headers
                  ?.filter((header) => visibleColumns[header])
                  .map((header) => (
                    <td
                      key={header}
                      className="border-b border-gray-200 px-4 py-2 text-center"
                    >
                      {row[header]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="py-4 text-center">Loading...</p>}
      </div>
    </div>
  );
};

export default InfiniteScrollTable;
