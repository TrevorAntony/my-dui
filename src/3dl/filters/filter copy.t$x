import React, { useState, useEffect, useRef } from "react";
import { useDashboardContext, setFilter } from "../utilities/Dashboard";
import DataContainer from "../utilities/DataContainer";
import useDuftQuery from "../../3dlcomponents/resources/useDuftQuery";

interface FilterProps {
  name: string;
  values?: string[];
  values_query?: string;
  caption?: string;
  className?: string;
}

const Filter: React.FC<FilterProps> = ({
  name,
  values = [],
  values_query,
  caption,
  className,
}) => {
  const { state, dispatch } = useDashboardContext();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const hasSetInitialFilter = useRef(false);

  useEffect(() => {
    if (!hasSetInitialFilter.current) {
      setFilter(dispatch, name, selectedValue);
      hasSetInitialFilter.current = true;
    }

    if (values.length > 0) {
      dispatch({
        type: "SET_DATA",
        payload: { key: name, data: values },
      });
    }
  }, [values, dispatch, name, selectedValue]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    setFilter(dispatch, name, value);
  };

  if (values_query) {
    const data = state.data[values_query];

    if (!data || data.length === 0) {
      return (
        <DataContainer query={values_query} useQuery={useDuftQuery}>
          <div>Loading options...</div>
        </DataContainer>
      );
    }

    // Dynamically extract the value from each object, assuming one key per object
    const transformedData = data
      .map((item: Record<string, string>) => {
        const value = Object.values(item)[0]; // Get the first value from the object
        return value ? value.trim() : "";
      })
      .filter((value) => value); // Filter out any empty strings

    return (
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className={className}
      >
        <option value="">{caption || `Filter ${name}`}</option>
        {transformedData.map((option: string, index: number) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select
      value={selectedValue}
      onChange={handleSelectChange}
      className={className}
    >
      <option value="">{caption || `Filter ${name}`}</option>
      {values.map((option: string, index: number) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Filter;
export type { FilterProps };
