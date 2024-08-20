import React from "react";

const TabSet = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ border: "2px solid blue", padding: "10px", margin: "10px" }}>
      {children}
    </div>
  );
};

export default TabSet;
