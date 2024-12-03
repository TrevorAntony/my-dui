import React, { useState } from "react";

interface ColumnToggleProps {
  headers: string[];
  visibleColumns: Record<string, boolean>;
  handleColumnToggle: (column: string) => void;
}

const ColumnToggle: React.FC<ColumnToggleProps> = ({
  headers,
  visibleColumns,
  handleColumnToggle,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button className="pt-2" onClick={() => setDropdownOpen((prev) => !prev)}>
        <svg
          className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-600"
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
  );
};

export default ColumnToggle;
