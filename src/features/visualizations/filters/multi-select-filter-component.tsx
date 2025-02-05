import React from "react";
import { MultiSelectFilter } from "../../../core/dashboard-3dl-parser";
import type { MultiSelectFilterProps } from "./multi-filter";

const DuftMultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  name,
  values,
  values_query,
  caption,
}) => {
  return (
    <MultiSelectFilter
      name={name}
      values={values}
      values_query={values_query}
      caption={caption}
      className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary-800"
    />
  );
};

export default DuftMultiSelectFilter;
