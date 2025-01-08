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
  toggleModal: (
    label: string,
    nodeQuery: string,
  ) => void,
) => {
  useEffect(() => {
    if (treeContainerRef.current && cascadeData) {
      const tree = new ApexTree(treeContainerRef.current, {
        ...defaultCascadeOptions,
        direction,
        nodeWidth: parsedNodeWidth,
        nodeHeight: parsedNodeHeight,
        height: cascadeScaleMap[cascadeScale],
        nodeTemplate: (content: Record<string, unknown>) => {
          const nodeId = content["nodeId"];
          const label = content["label"];
          let value = content["value"];
          const query = content["query"];

          if (typeof value === "number") {
            const formatter = new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
            value = formatter.format(value);
          }
          return `
            <div
              data-id="${nodeId}"
              data-label="${label}"
              data-value="${value}"
              data-query="${query}"
              class="apextree-node"
              style="display: flex; flex-direction: column; align-items: flex-start; height: auto; cursor: pointer; padding: 5%; justify-content: space-between; border-radius: 10px;">
              <div style="font-size: 1.5em; color: #333333;">${label}</div>
              <div style="font-size: 2.5em; line-height: 1.50; font-weight: 400;">${value}</div>
            </div>`;
        },
      });
      tree.render(cascadeData);

      // Add event listeners after rendering
      const nodesElements =
        treeContainerRef.current.querySelectorAll(".apextree-node");
      nodesElements.forEach((nodeElement) => {
        nodeElement.addEventListener("click", (event) => {
          const target = event.currentTarget as HTMLElement;
          const nodeQuery = target.getAttribute("data-query");
          const nodeLabel = target.getAttribute("data-label");
          if (nodeLabel && nodeQuery) {
            toggleModal(nodeLabel, nodeQuery);
          }
        });
      });

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
    toggleModal,
  ]);
};
