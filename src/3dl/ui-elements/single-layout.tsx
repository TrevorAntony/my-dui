import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

const LayoutContext = createContext("default-layout");

export const useLayout = () => useContext(LayoutContext);

interface SingleLayoutProps {
  children: ReactNode;
}

const SingleLayout: React.FC<SingleLayoutProps> = ({ children }) => {
  return (
    <LayoutContext.Provider value="single-layout">
      <div style={{ width: "100%" }}>{children}</div>
    </LayoutContext.Provider>
  );
};

export default SingleLayout;
