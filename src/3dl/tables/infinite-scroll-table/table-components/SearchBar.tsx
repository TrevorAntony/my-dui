import React from "react";
import { FiSearch, FiLoader } from "react-icons/fi";

interface SearchBarProps {
  searchText: string;
  handleSearchChange: (value: string) => void;
  loading: boolean;
  searchColumns: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  handleSearchChange,
  loading,
  searchColumns,
}) => (
  <div className="relative flex-1" style={{ maxWidth: "500px" }}>
    <input
      type="text"
      placeholder={`Search by ${searchColumns}`}
      value={searchText}
      onChange={(e) => handleSearchChange(e.target.value)}
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
);

export default SearchBar;
