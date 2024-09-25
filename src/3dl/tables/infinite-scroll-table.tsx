import React, { useRef } from "react";
import { useDataContext } from "../context/DataContext";

const InfiniteScrollTable: React.FC = () => {
  const { data, loading, pageUpdater, searchText, handleSearchChange } =
    useDataContext();

  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const table = tableRef.current;
    if (table) {
      const { scrollTop, scrollHeight, clientHeight } = table;

      if (scrollTop + clientHeight >= scrollHeight - 1 && !loading) {
        pageUpdater?.();
      }
    }
  };

  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearchChange?.(e.target.value)}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

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
            {data?.map((row) => (
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
