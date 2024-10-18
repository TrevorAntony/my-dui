import React from "react";

interface RowProps {
  children: React.ReactNode;
  data?: unknown;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const Row: React.FC<RowProps> = ({ children, style = {}, ...props }) => {
  const childrenCount = React.Children.count(children);

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${childrenCount}, 1fr)`,
    gap: "1.5rem",
    padding: "1rem",
    ...style,
  };

  return (
    <div style={rowStyle} {...props}>
      {children}
    </div>
  );
};

export default Row;
