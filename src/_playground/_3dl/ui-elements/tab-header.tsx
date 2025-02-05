import React from "react";

const TabHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ border: "2px solid green", padding: "10px", margin: "10px" }}>
      {children}
    </div>
  );
};

export default TabHeader;
