import React, { useState } from "react";

interface TableHeaderProps {
  headers: string[];
  visibleColumns: Record<string, boolean>;
  sortState: Record<string, "ASC" | "DESC" | null>;
  handleSort: (column: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  headers,
  visibleColumns,
  sortState,
  handleSort,
}) => {
  const [preservedHeaders, setPreservedHeaders] = useState<string[]>(headers);

  if (
    headers.length > 0 &&
    JSON.stringify(headers) !== JSON.stringify(preservedHeaders)
  ) {
    setPreservedHeaders(headers);
  }

  return (
    <thead className="bg-gray-50 text-sm uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {preservedHeaders
          ?.filter((header) => visibleColumns[header])
          .map((header) => (
            <th
              key={header}
              scope="col"
              className="sticky top-0 cursor-pointer bg-gray-50 px-6 py-3 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => handleSort(header)}
            >
              <div className="flex items-center">
                {header.charAt(0).toUpperCase() + header.slice(1)}
                <svg
                  className={`ml-1.5 ${
                    sortState[header] ? "h-5 w-5" : "h-4 w-4"
                  } ${
                    sortState[header]
                      ? "text-highlight-600 dark:text-highlight-600"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {sortState[header] ? (
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        sortState[header] === "ASC"
                          ? "M8 20V10m0 10-3-3m3 3 3-3" // Up
                          : "M8 10v10m0-10-3 3m3-3 3 3" // Down
                      }
                    />
                  ) : (
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 20V10m0 10-3-3m3 3 3-3m5-13v10m0-10 3 3m-3-3-3 3"
                    />
                  )}
                </svg>
              </div>
            </th>
          ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
