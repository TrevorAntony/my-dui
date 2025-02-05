import React, { useState, useEffect } from "react";
import { Dropdown } from "flowbite-react";
import { useDashboardContext, setFilter } from "../dashboard/Dashboard";
import useQuery from "../../data-components/hooks/useQuery";

export interface MultiSelectFilterProps {
  name: string;
  values?: string;
  values_query?: string;
  caption?: string;
  className?: string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  name,
  values,
  values_query,
  caption,
  className,
}) => {
  const context = useDashboardContext();
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  const { state, dispatch } = context;
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { data: options, loading } = useQuery(values_query);

  useEffect(() => {
    if (!isLoaded && !loading) {
      let loadedOptions: { label: string; value: string }[] = [];
      if (values_query && options) {
        // Map the options to include both label and value
        loadedOptions = (options as { [key: string]: string }[]).map(
          (option) => ({
            label: option["label"] || Object.values(option)[0] || "",
            value:
              option["value"] ||
              Object.values(option)[1] ||
              Object.values(option)[0] ||
              "",
          })
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

  useEffect(() => {
    if (state.filters[name]) {
      setSelectedValues(state.filters[name] as unknown as string[]);
    }
  }, [state.filters, name]);

  const toggleSelection = (option: { label: string; value: string }) => {
    const newSelectedValues = selectedValues.includes(option.value)
      ? selectedValues.filter((id) => id !== option.value)
      : [...selectedValues, option.value];

    setSelectedValues(newSelectedValues);
    setFilter(dispatch, name, newSelectedValues);
  };

  return (
    <div className={className}>
      <Dropdown
        label={caption}
        color="gray"
        dismissOnClick={false}
        inline
        theme={{
          floating: {
            base: "z-10 w-fit rounded-lg bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600",
            content: "py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200",
          },
        }}
      >
        {(
          (state.data[name] || []) as unknown as {
            label: string;
            value: string;
          }[]
        ).map((option, index) => (
          <Dropdown.Item
            key={index}
            className="hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => toggleSelection(option)}
                className="form-checkbox h-5 w-5 text-highlight-600 focus:ring-highlight-300"
              />
              <span className="text-gray-700 dark:text-gray-200">
                {option.label}
              </span>
            </label>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default MultiSelectFilter;
