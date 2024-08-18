import React, { useState, useContext, useEffect } from 'react';
import { DashboardContext } from '../utilities/Dashboard';
import useQuery from '../utilities/useQuery';

// Individual Filter component that fetches options or uses hard-coded values
const Filter = ({ name, values, values_query }) => {
  const { state, dispatch } = useContext(DashboardContext);
  const [selectedValue, setSelectedValue] = useState('');
  const { data: options, loading, error } = useQuery(values_query);

  useEffect(() => {
    if (values) {
      // Split static values by comma and dispatch
      dispatch({ type: 'SET_DATA', payload: { key: name, data: values.split(',') } });
    } else if (values_query) {
      // Extract strings from the JSON blobs returned by the query
      const extractedOptions = options.map(option => {
        // Assuming each option is an object with a single key-value pair
        return Object.values(option)[0];
      });

      // Dispatch the extracted strings
      dispatch({ type: 'SET_DATA', payload: { key: name, data: extractedOptions } });
    }
  }, [values, options, values_query, dispatch, name]);

  // Handle changes in selection
  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    dispatch({ type: 'SET_FILTER', payload: { name, value } });
  };

  if (loading) {
    return <div>Loading options...</div>;
  }

  if (error) {
    return <div>Error fetching options: {error.message}</div>;
  }

  return (
    <div style={{ margin: '10px' }}>
      <label>
        {name}:
        <select value={selectedValue} onChange={handleSelectChange}>
          <option value="">Select {name}</option>
          {(state.data[name] || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Filter;