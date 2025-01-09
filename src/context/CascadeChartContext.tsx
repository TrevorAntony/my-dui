import { createContext } from "react";
import type { CascadeNodeProps } from "../types/cascade";

interface CascadeChartContextProps {
  addCascadeNode: (nodeData: CascadeNodeProps) => void;
}
const CascadeChartContext = createContext<CascadeChartContextProps | undefined>(
  undefined,
);

export default CascadeChartContext;
