import React, { useState, useRef } from "react";
import { useDataContext } from "../context/DataContext";

const InfiniteScrollTable: React.FC = () => {
  const { data, loading = false } = useDataContext();
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const table = tableRef.current;
    if (table) {
      const { scrollTop, scrollHeight, clientHeight } = table;

      // Add a small tolerance (e.g., 5px) to detect when we're near the bottom
      if (scrollTop + clientHeight >= scrollHeight - 1 && !loading) {
        console.log("bottom reached");
      }
    }
  };

  // Filter data based on search query
  const filteredData = data?.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Check if there's any data to extract headers
  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div>
      {/* Search input field in the header */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

      {/* Scrollable table */}
      <div
        ref={tableRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-auto border border-gray-300"
      >
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {headers?.map((header) => (
                <th
                  key={header}
                  className="sticky top-0 border-b border-gray-300 bg-gray-100 px-4 py-2 text-left"
                >
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((row) => (
              <tr key={row.id}>
                {headers?.map((header) => (
                  <td
                    key={header}
                    className="border-b border-gray-200 px-4 py-2"
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
