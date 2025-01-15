import React from "react";
import { MultiSelectFilter } from "../3dl";
import type { MultiSelectFilterProps } from "../3dl/filters/multi-filter";


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
      className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900" />
  );
};

export default DuftMultiSelectFilter;