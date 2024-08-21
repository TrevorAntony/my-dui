import React from "react";

type TabSetProps = {
  children: React.ReactNode;
  override?: React.ComponentType<{ children: React.ReactNode }>;
};

const TabSet: React.FC<TabSetProps> = ({ children, override: Override }) => {
  if (Override) {
    return <Override>{children}</Override>;
  }

  return (
    <div style={{ border: "2px solid blue", padding: "10px", margin: "10px" }}>
      {children}
    </div>
  );
};

export default TabSet;
