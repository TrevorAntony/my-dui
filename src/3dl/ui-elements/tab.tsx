import React from "react";

const Tab = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ border: "2px solid red", padding: "10px", margin: "10px" }}>
      {children}
    </div>
  );
};

export default Tab;
