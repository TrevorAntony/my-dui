import React, { useState, useEffect } from "react";
import { Dropdown } from 'flowbite-react';
import { useDashboardContext, setFilter } from "../utilities/Dashboard";
import useQuery from "../utilities/useQuery";

export interface MultiSelectFilterProps {
  name: string;
  values?: string;
  values_query?: string;
  caption?: string;
  className?: string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = (
  { 
  name,
  values,
  values_query,
  caption,
  className
  }) => {

  const context = useDashboardContext();
    if (!context) {
      throw new Error(
        "useDashboardContext must be used within a DashboardProvider",
      );
    }
  const { state, dispatch } = context;
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { data: options, loading, error } = useQuery(values_query);

 useEffect(() => {
    if (!isLoaded && !loading) {
      let loadedOptions: string[] = [];
      if (values) {
        loadedOptions = values.split(",");
      } else if (values_query && options) {
        loadedOptions = (options as { [key: string]: string }[]).map(
          (option) => Object.values(option)[0] || ""
        );
      }
      dispatch({
        type: "SET_DATA",
        payload: { key: name, data: loadedOptions },
      });
      setIsLoaded(true);
    }
  }, [values, options, values_query, loading, dispatch, name, isLoaded]);


  useEffect(() => {
    if (isLoaded) {
      setFilter(dispatch, name, selectedValues);
    }
  }, [dispatch, name, selectedValues, isLoaded]);

  const toggleSelection = (optionId: string) => {
    setSelectedValues(prevSelectedValues =>
      prevSelectedValues.includes(optionId)
        ? prevSelectedValues.filter(id => id !== optionId)
        : [...prevSelectedValues, optionId]
    );
  };

  return (
    <div className={className}>
    <Dropdown label={caption} color="gray"  dismissOnClick={false} inline >
      {(state.data[name] || []).map((option: string, index: number) => (
        <Dropdown.Item key={index}  className="hover:bg-highlight-600">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => toggleSelection(option)}
              className="form-checkbox h-5 w-5 text-highlight-600 focus:ring-primary-300"
            />
            <span>{option}</span>
          </label>
        </Dropdown.Item>
      ))}
    </Dropdown>
    </div>
  );
};

export default MultiSelectFilter;