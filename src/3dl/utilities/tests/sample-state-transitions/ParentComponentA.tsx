import React, { createContext, useContext } from "react";

interface StateContextType {
  state: any;
  setState: (value: any) => void;
}

const StateContext = createContext<StateContextType>({
  state: null,
  setState: () => {},
});

interface ParentComponentAProps {
  children: React.ReactNode;
  state: any;
  setState: (value: any) => void;
}

const ParentComponentA = ({
  children,
  state,
  setState,
}: ParentComponentAProps) => {
  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a ParentComponentA");
  }
  return context;
};

export default ParentComponentA;
