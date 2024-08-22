import React from "react";

const DashboardRow = ({ children, data, style = {}, ...props }) => {
  const childrenCount = React.Children.count(children);

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${childrenCount}, 1fr)`,
    gap: "1rem",
    ...style,
  };

  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { data })
  );

  return (
    <div style={rowStyle} {...props}>
      {childrenWithProps}
    </div>
  );
};

export default DashboardRow;
