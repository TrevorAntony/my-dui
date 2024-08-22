import React from "react";

const Grid = ({ children, ...props }) => {
  // Pass props from Grid to its children
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, props)
  );

  return <div style={{ border: "1px solid green" }}>{childrenWithProps}</div>;
};

export default Grid;
