import React from 'react';

// Filters component to structure child components
const Filters = ({ children }) => {
  return (
    <div className="flex-auto space-x-4 lg:pr-3">
      {children}
    </div>

  );
};

export default Filters;