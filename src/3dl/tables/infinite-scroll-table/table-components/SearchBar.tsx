import React from "react";
import { FiSearch, FiLoader } from "react-icons/fi";

interface SearchBarProps {
  searchText: string;
  handleSearchChange: (value: string) => void;
  loading: boolean;
  searchColumns: string;
  searchHint?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  handleSearchChange,
  loading,
  searchColumns,
  searchHint,
}) => (
  <div className="relative float-right flex-1" style={{ maxWidth: "250px" }}>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        {loading ? (
          <FiLoader className="animate-spin text-gray-500" />
        ) : (
          <FiSearch className="text-gray-500" />
        )}
      </div>
      <input
        type="text"
        placeholder={`Search by ${searchHint || searchColumns}`}
        value={searchText}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
    </div>
  </div>
);

export default SearchBar;
