import { useState, useCallback, useEffect, useRef } from "react";
import {
  createCascadeObject,
  cleanEmptyChildren,
} from "../../helpers/cascade-helpers";
import { defaultCascadeOptions } from "../../helpers/constants";
import type { Cascade, CascadeNodeProps } from "../../types/cascade";
import type { VisualProps } from "../../types/visual-props";
import CascadeChartContext from "../../context/CascadeChartContext";
import { useRenderTree } from "../../hooks/useRenderTree";
import getInfoTagContents from "../../helpers/get-info-tag-content";

const CascadeChart = ({
  container: Container,
  header,
  subHeader = "",
  direction = defaultCascadeOptions.direction,
  nodeWidth = defaultCascadeOptions.nodeWidth,
  nodeHeight = defaultCascadeOptions.nodeHeight,
  cascadeScale = "standard",
  exportData,
  detailsComponent,
  children,
  DataStringQuery,
}: VisualProps) => {
  const [nodes, setNodes] = useState<CascadeNodeProps[]>([]);
  const [cascadeData, setCascadeData] = useState<Cascade | null>(null);
  const treeContainerRef = useRef<HTMLDivElement | null>(null);

  const addCascadeNode = useCallback((nodeData: CascadeNodeProps) => {
    setNodes((prevNodes) => {
      const existingNodeIndex = prevNodes.findIndex(
        (node) => node.id === nodeData.id,
      );
      if (existingNodeIndex !== -1) {
        const updatedNodes = [...prevNodes];
        updatedNodes[existingNodeIndex] = {
          ...prevNodes[existingNodeIndex],
          data: nodeData.data,
        };
        return updatedNodes;
      }
      return [...prevNodes, nodeData];
    });
  }, []);

  useEffect(() => {
    const updatedCascadeData = createCascadeObject(nodes, cleanEmptyChildren);
    setCascadeData(updatedCascadeData);
  }, [nodes]);

  const parsedNodeWidth = Number(nodeWidth) || defaultCascadeOptions.nodeWidth;
  const parsedNodeHeight =
    Number(nodeHeight) || defaultCascadeOptions.nodeHeight;

  useRenderTree(
    treeContainerRef,
    cascadeData,
    direction,
    parsedNodeWidth,
    parsedNodeHeight,
    cascadeScale,
  );

  const content = (
    <CascadeChartContext.Provider value={{ addCascadeNode }}>
      {children}
      <div
        ref={treeContainerRef}
        id="svg-tree"
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          ...defaultCascadeOptions.canvasStyle,
        }}
      ></div>
    </CascadeChartContext.Provider>
  );

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      infoTagContent={getInfoTagContents(children)}
      DataStringQuery={DataStringQuery}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default CascadeChart;
