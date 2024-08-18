import React, { useContext, useEffect } from 'react';
import { DashboardContext } from './Dashboard';
import useQuery from './useQuery';

// DataContainer component that uses filters and renders visuals
const DataContainer = ({ query, staticData, children }) => {
  const { state, dispatch } = useContext(DashboardContext);
  const { data: fetchedData, loading, error } = useQuery(
    query 
  );

  const data = staticData || fetchedData;

  useEffect(() => {
    if (staticData) {
      dispatch({ type: 'SET_DATA', payload: { key: query || 'static', data: staticData } });
    } else if (!loading && !error) {
      dispatch({ type: 'SET_DATA', payload: { key: query, data: fetchedData } });
    }
  }, [staticData, fetchedData, loading, error, dispatch, query]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  // Clone each child and pass the data as a prop
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { data })
  );

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <h1>Data Container</h1>
      {/* Conditionally render Debug On if debug is true */}
      {state.debug && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          Debug On
        </div>
      )}
      {childrenWithProps}
    </div>
  );
};

export default DataContainer;