import React from "react";

const DashboardBodyOverride: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div style={{ border: "2px solid red", padding: "10px", margin: "10px" }}>
      {children}
    </div>
  );
};

export default DashboardBodyOverride;
