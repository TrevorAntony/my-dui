import React from "react";

const ChartComponent = ({
  children,
}: {
  header?: string;
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ChartComponent;
