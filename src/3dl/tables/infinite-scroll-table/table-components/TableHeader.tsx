import React from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

interface TableHeaderProps {
  headers: string[];
  visibleColumns: Record<string, boolean>;
  sortState: Record<string, "ASC" | "DESC" | null>; // Null for unsorted columns
  handleSort: (column: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  headers,
  visibleColumns,
  sortState,
  handleSort,
}) => (
  <thead className="bg-gray-50">
    <tr>
      {headers
        ?.filter((header) => visibleColumns[header])
        .map((header) => (
          <th
            key={header}
            className="sticky top-0 cursor-pointer select-none bg-gray-100 px-4 py-2 text-left text-gray-500 hover:text-gray-900"
            onClick={() => handleSort(header)}
          >
            <div className="flex items-center justify-start space-x-2">
              <span>{header.charAt(0).toUpperCase() + header.slice(1)}</span>
              {sortState[header] && (
                <span>
                  {sortState[header] === "ASC" ? (
                    <FiChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
    </tr>
  </thead>
);

export default TableHeader;
