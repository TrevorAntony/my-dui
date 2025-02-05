/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface DashboardRowProps {
  children: React.ReactNode;
  data: any;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const DashboardRow: React.FC<DashboardRowProps> = ({
  children,
  data,
  style = {},
  ...props
}) => {
  const childrenCount = React.Children.count(children);

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${childrenCount}, 1fr)`,
    gap: "1rem",
    ...style,
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<{ data?: any }>, {
        data,
      });
    }
    return child;
  });

  return (
    <div style={rowStyle} {...props}>
      {childrenWithProps}
    </div>
  );
};

export default DashboardRow;
