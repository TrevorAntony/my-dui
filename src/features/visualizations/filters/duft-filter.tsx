import React from "react";
import type { FilterProps } from "./filter";
import Filter from "./filter";

const DuftFilter: React.FC<FilterProps> = ({
  name,
  values,
  values_query,
  caption,
}) => {
  return (
    <Filter
      name={name}
      values={values}
      values_query={values_query}
      caption={caption}
      className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:focus:ring-highlight-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-highlight-700"
    />
  );
};

export default DuftFilter;
