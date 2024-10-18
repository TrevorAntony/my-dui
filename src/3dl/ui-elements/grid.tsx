import React from "react";

const Grid = ({ children, ...props }: { children: React.ReactNode }) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });

  return <div style={{ border: "1px solid green" }}>{childrenWithProps}</div>;
};

export default Grid;
