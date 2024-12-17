import { useEffect } from "react";
import ApexTree from "apextree";
import { cascadeScaleMap } from "../helpers/constants";
import { defaultCascadeOptions } from "../helpers/constants";
import type { Cascade } from "../types/cascade";

export const useRenderTree = (
  treeContainerRef: React.RefObject<HTMLDivElement>,
  cascadeData: Cascade | null,
  direction: string,
  parsedNodeWidth: number,
  parsedNodeHeight: number,
  cascadeScale: keyof typeof cascadeScaleMap,
) => {
  useEffect(() => {
    if (treeContainerRef.current && cascadeData) {
      const tree = new ApexTree(treeContainerRef.current, {
        ...defaultCascadeOptions,
        direction,
        nodeWidth: parsedNodeWidth,
        nodeHeight: parsedNodeHeight,
        height: cascadeScaleMap[cascadeScale],
      });
      tree.render(cascadeData);

      const currentContainer = treeContainerRef.current;
      return () => {
        if (currentContainer) {
          currentContainer.innerHTML = "";
        }
      };
    }
    return undefined;
  }, [
    cascadeData,
    treeContainerRef,
    direction,
    parsedNodeWidth,
    parsedNodeHeight,
    cascadeScale,
  ]);
};
