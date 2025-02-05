import { useState, useCallback, useEffect, useRef } from "react";
import {
  createCascadeObject,
  cleanEmptyChildren,
} from "../../visualizations/chart-visuals/cascade-chart/helpers/cascade-helpers";
import { defaultCascadeOptions } from "../../utils/constants";
import type {
  Cascade,
  CascadeNodeProps,
} from "../../visualizations/chart-visuals/cascade-chart/types/cascade";
import type { VisualProps } from "../../visualizations/types/visual-props";
import CascadeChartContext from "../../context/CascadeChartContext";
import { useRenderTree } from "../../visualizations/chart-visuals/cascade-chart/hooks/useRenderTree";
import getInfoTagContents from "../../visualizations/visual-utils/info-tag/helpers/get-info-tag-content";
import { Button, Modal } from "flowbite-react";
import useDuftQuery from "../../core/duft-core-components/data-components/hooks/useDuftQuery";
import InfiniteScrollTable from "../tables/infinite-scroll-table/infinite-scroll-table";
import Dataset from "../../core/duft-core-components/data-components/data-set";
import CardComponent from "../../visualizations/visual-utils/card-component";

const CascadeChart = ({
  container: Container,
  header,
  subHeader = "",
  direction = defaultCascadeOptions.direction,
  nodeWidth = defaultCascadeOptions.nodeWidth,
  nodeHeight = defaultCascadeOptions.nodeHeight,
  cascadeScale = "standard",
  cascadeSearchColumn,
  exportData,
  detailsComponent,
  children,
  DataStringQuery,
}: VisualProps) => {
  const [nodes, setNodes] = useState<CascadeNodeProps[]>([]);
  const [cascadeData, setCascadeData] = useState<Cascade | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCascadeState, setModalCascadeState] = useState({
    cascadeTitle: "",
    cascadeDetailsQuery: "",
  });
  const treeContainerRef = useRef<HTMLDivElement | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addCascadeNode = useCallback((nodeData: CascadeNodeProps) => {
    setNodes((prevNodes) => {
      const existingNodeIndex = prevNodes.findIndex(
        (node) => node.id === nodeData.id
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

  const toggleModal = useCallback((label: string, nodeQuery: string) => {
    setModalCascadeState((prevState) => ({
      ...prevState,
      cascadeTitle: label,
      cascadeDetailsQuery: nodeQuery,
    }));
    setIsModalOpen((prev) => !prev);
  }, []);

  useRenderTree(
    treeContainerRef,
    cascadeData,
    direction,
    parsedNodeWidth,
    parsedNodeHeight,
    cascadeScale,
    toggleModal
  );

  const content = (
    <>
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
      <Modal
        show={isModalOpen}
        onClose={() => handleCloseModal()}
        position="center"
        size="7xl"
      >
        <Modal.Header>{modalCascadeState.cascadeTitle}</Modal.Header>
        <Modal.Body className="flex flex-col overflow-hidden ">
          <Dataset
            useQuery={useDuftQuery}
            query={modalCascadeState.cascadeDetailsQuery}
            pageSize={20}
            searchColumns={cascadeSearchColumn}
          >
            <InfiniteScrollTable container={CardComponent} variant="plain" />
          </Dataset>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button onClick={() => handleCloseModal()} color="primary">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
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
