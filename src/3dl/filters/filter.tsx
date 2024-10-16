import React, { useState, useEffect } from "react";
import { useDashboardContext, setFilter } from "../utilities/Dashboard";
import useQuery from "../utilities/useQuery";

export interface FilterProps {
  name: string;
  values?: string;
  values_query?: string;
  caption?: string;
  className?: string;
}

const Filter: React.FC<FilterProps> = ({
  name,
  values,
  values_query,
  caption,
  className,
}) => {
  const context = useDashboardContext();
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider",
    );
  }
  const { state, dispatch } = context;
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
        loadedOptions = (options as { [key: string]: string }[]).map(
          (option) => {
            return Object.values(option)[0] || "";
          },
        );
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
    const errorMessage = (error as { message: string }).message;
    return <div>Error fetching options: {errorMessage}</div>;
  }

  return (
    <select
      value={selectedValue}
      onChange={handleSelectChange}
      className={className}
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
