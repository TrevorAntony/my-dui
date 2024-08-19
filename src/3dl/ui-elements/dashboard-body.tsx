import React from "react";

type DashboardBodyProps = {
  children: React.ReactNode;
  OverrideComponent?: React.ComponentType<{ children: React.ReactNode }>;
};

const DashBoardBody: React.FC<DashboardBodyProps> = ({
  children,
  OverrideComponent,
}) => {
  if (OverrideComponent) {
    return <OverrideComponent>{children}</OverrideComponent>;
  }

  return (
    <div
      style={{ border: "2px solid purple", padding: "10px", margin: "10px" }}
    >
      {children}
    </div>
  );
};

export default DashBoardBody;
