import React from "react";

interface TabProps {
  children: React.ReactNode;
  override?: React.ComponentType<{ children: React.ReactNode }>;
}

const Tab: React.FC<TabProps> = ({ children, override: OverrideComponent }) => {
  if (OverrideComponent) {
    return <OverrideComponent>{children}</OverrideComponent>;
  }

  return (
    <div style={{ border: "2px solid red", padding: "10px", margin: "10px" }}>
      {children}
    </div>
  );
};

export default Tab;
