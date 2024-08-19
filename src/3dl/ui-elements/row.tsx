import React from "react";

const Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{ border: "2px solid orange", padding: "10px", margin: "10px" }}
    >
      {children}
    </div>
  );
};

export default Row;
