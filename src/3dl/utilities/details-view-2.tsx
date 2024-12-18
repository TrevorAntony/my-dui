import React from "react";
import DetailsViewContext from "./details-view-context";

interface DetailsViewProps {
  columnName: string;
  config: { [key: string]: string };
  children: React.ReactNode;
}

const DetailsView2: React.FC<DetailsViewProps> = ({
  columnName,
  config,
  children,
}) => {
  return (
    <DetailsViewContext.Provider value={{ columnName, config }}>
      {children}
    </DetailsViewContext.Provider>
  );
};

export default DetailsView2;
