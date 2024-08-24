import React, { useState, useEffect } from 'react';
import { useDashboardContext, setFilter } from '../utilities/Dashboard';
import useQuery from '../utilities/useQuery';

// Individual Filter component that fetches options or uses hard-coded values
const Filter = ({ name, values, values_query }) => {
  const { state, dispatch } = useDashboardContext();
  const [selectedValue, setSelectedValue] = useState('');
  const { data: options, loading, error } = useQuery(values_query);

  useEffect(() => {
    // Immediately set the filter in the state with an empty string value
    setFilter(dispatch, name, selectedValue);

    if (values) {
      // Split static values by comma and dispatch to data state
      dispatch({ type: 'SET_DATA', payload: { key: name, data: values.split(',') } });
    } else if (values_query) {
      // Extract strings from the JSON blobs returned by the query
      const extractedOptions = options.map(option => {
        // Assuming each option is an object with a single key-value pair
        return Object.values(option)[0];
      });

      // Dispatch the extracted strings to data state
      dispatch({ type: 'SET_DATA', payload: { key: name, data: extractedOptions } });
    }
  }, [values, options, values_query, dispatch, name, selectedValue]);

  // Handle changes in selection
  const handleSelectChange = (event) => {
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
      <option value="">Filter {name}</option>
      {(state.data[name] || []).map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Filter;