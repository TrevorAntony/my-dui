import React, { useEffect, useContext } from "react";
import CascadeChartContext from "../../../../../core/context/CascadeChartContext";
import { useDataContext } from "../../../../../core/context/DataContext";
import type { CascadeNodeProps } from "../types/cascade";

const CascadeNode: React.FC<CascadeNodeProps> = ({
  id,
  parentId,
  label,
  options,
  detailsViewQuery,
  children,
}) => {
  const { addCascadeNode } = useContext(CascadeChartContext);
  const { data, loading } = useDataContext();

  useEffect(() => {
    if (addCascadeNode && data && !loading) {
      const nodeData = {
        id,
        parentId,
        label,
        options,
        data: data as { value: number }[],
        detailsViewQuery,
      };
      addCascadeNode(nodeData);
    }
  }, [
    id,
    parentId,
    label,
    options,
    data,
    loading,
    detailsViewQuery,
    addCascadeNode,
  ]);

  return <>{children}</>;
};

export default CascadeNode;
