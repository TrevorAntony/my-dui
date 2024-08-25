import React, { useState, useEffect } from "react";
import { useDashboardContext, setFilter } from "../utilities/Dashboard";
import useQuery from "../utilities/useQuery";

// Define the props type for Filter component
export interface FilterProps {
  name: string;
  values?: string;
  values_query?: string;
  caption?: string;
}

// Individual Filter component that fetches options or uses hard-coded values
const Filter: React.FC<FilterProps> = ({
  name,
  values,
  values_query,
  caption,
}) => {
  const { state, dispatch } = useDashboardContext();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { data: options, loading, error } = useQuery(values_query);

  useEffect(() => {
    if (!isLoaded && !loading) {
      let loadedOptions: string[] = [];

      if (values) {
        // Split static values by comma and dispatch to data state
        loadedOptions = values.split(",");
      } else if (values_query && options) {
        // Extract strings from the JSON blobs returned by the query
        loadedOptions = options.map((option) => {
          return Object.values(option)[0];
        });
      }

      // Dispatch the loaded options to data state
      dispatch({
        type: "SET_DATA",
        payload: { key: name, data: loadedOptions },
      });

      setIsLoaded(true); // Mark as loaded after processing the data
    }
  }, [values, options, values_query, loading, dispatch, name, isLoaded]);

  useEffect(() => {
    // Ensure state is set after loading
    if (isLoaded && selectedValue === "") {
      setFilter(dispatch, name, selectedValue);
    }
  }, [dispatch, name, selectedValue, isLoaded]);

  // Handle changes in selection
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    setFilter(dispatch, name, value); // Use setFilter utility to update the filter state
  };

  if (loading) {
    return <div>Loading options...</div>;
  }

  if (error) {
    return <div>Error fetching options: {error.message}</div>;
  }

  return (
    <select
      value={selectedValue}
      onChange={handleSelectChange}
      className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary-800"
    >
      <option value="">{caption || `Filter ${name}`}</option>
      {(state.data[name] || []).map((option: string, index: number) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Filter;
