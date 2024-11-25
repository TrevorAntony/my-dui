import { useMemo, useState, useEffect, useContext, useCallback } from "react";
import { DashboardContext } from "../utilities/Dashboard";
import type { DashboardState } from "../../types/dashboard";
import ApexTree from "apextree";
import fetchCascade from "../../helpers/cascade-helpers";
import DuftModal from "../../components/duft-modal";
import CascadeSkeleton from "../../ui-components/cascade-skeleton";
import { cascadeDefaultOptions } from "../../helpers/constants";
import type { Cascade } from "../../types/cascade";
import { DataProvider } from "../context/DataContext";
import InfiniteScrollTable from "../tables/infinite-scroll-table/infinite-scroll-table";
import type { VisualProps } from "../../types/visual-props";
import CardComponent from "../../components/card-component";
import getInfoTagContents from "../../helpers/get-info-tag-content";

const CascadeChart = ({
  container: Container,
  header,
  subHeader = "",
  cascadeObject,
  direction = cascadeDefaultOptions.direction,
  nodeWidth = cascadeDefaultOptions.nodeWidth,
  nodeHeight = cascadeDefaultOptions.nodeHeight,
  resize,
  exportData,
  detailsComponent,
  children,
}: VisualProps) => {
  const { state } = useContext(DashboardContext) || {
    state: {} as DashboardState,
  };
  const [cascadeData, setCascadeData] = useState<Cascade | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cascadeTitle, setCascadeTitle] = useState("");
  const [modalCascadeHeadLabels, setModalCascadeHeadLabels] = useState([]);
  const [modalCascadeData, setModalCascadeData] = useState([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const cascade = useMemo(() => cascadeObject, [cascadeObject]);

  const fetchCascadeData = useCallback(
    async (dataStructure: Record<string, unknown>) => {
      async function processNode(node: Record<string, unknown>) {
        const { query } = node["data"] as { query: string };
        const queryResult = await fetchCascade(query, state.filters);
        const result: Cascade = {
          id: node["id"] as string,
          options: node["options"] ? node["options"] : [],
          data: {
            id: node["id"],
            label: (node["data"] as { label: string }).label,
            details: queryResult,
            value: queryResult.length,
          },
        };

        if (node["children"] && (node["children"] as unknown[]).length > 0) {
          const childResults = await Promise.allSettled(
            (node["children"] as Record<string, unknown>[]).map(processNode),
          );

          result.children = childResults.map((childResult, index) => {
            if (childResult.status === "fulfilled") {
              return childResult.value;
            } else {
              console.error(
                `Error processing child node ${(
                  node["children"] as Record<string, unknown>[]
                )[index]?.["id"]}:`,
                (childResult as { reason: string }).reason,
              );
              return {
                id:
                  (node["children"] as Record<string, unknown>[])[index]?.[
                    "id"
                  ] ?? null,
                error: true,
                message: "Failed to fetch data",
                children: [],
                options: [],
                data: {
                  id: (node["children"] as Record<string, unknown>[])[index]?.[
                    "id"
                  ],
                  label: (
                    node["children"] as Array<{ data: { label: string } }>
                  )?.[index]?.data.label,
                  details: null,
                  value: 0,
                },
              };
            }
          });
        }

        return result;
      }

      try {
        setCascadeData(null);
        const results: Cascade = await processNode(dataStructure);
        setCascadeData(results);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    },
    [state.filters],
  );

  useEffect(() => {
    fetchCascadeData(cascade);
  }, [cascade, fetchCascadeData]);

  useEffect(() => {
    if (!cascadeData) {
      return undefined;
    }

    const svgElement = document.getElementById("svg-tree");
    if (!svgElement) {
      console.error("Element with id 'svg-tree' not found");
      return undefined;
    }

    const parsedNodeWidth =
      Number(nodeWidth) || cascadeDefaultOptions.nodeWidth;
    const parsedNodeHeight =
      Number(nodeHeight) || cascadeDefaultOptions.nodeHeight;

    const tree = new ApexTree(svgElement, {
      ...cascadeDefaultOptions,
      direction,
      nodeWidth: parsedNodeWidth,
      nodeHeight: parsedNodeHeight,
    });
    tree.render(cascadeData);

    const toggleModal = (
      label: string,
      details: Record<string, unknown>[],
      headLabels: string[],
    ) => {
      setModalCascadeData(details);
      setCascadeTitle(label);
      setModalCascadeHeadLabels(headLabels);
      setIsModalOpen(!isModalOpen);
    };

    const traverseNodes = (node: Cascade) => {
      const { id, label, details } = node.data;
      const headLabels = details.length > 0 ? Object.keys(details[0]) : [];

      const nodeElement = document.getElementById(id);

      if (nodeElement) {
        nodeElement.addEventListener("click", () => {
          toggleModal(label, details, headLabels);
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child: Cascade) => traverseNodes(child));
      }
    };

    traverseNodes(cascadeData);

    return () => {
      if (tree && typeof tree.destroy === "function") {
        tree.destroy();
      } else {
        svgElement.innerHTML = "";
      }
    };
  }, [cascadeData, isModalOpen, direction, nodeWidth, nodeHeight]);

  if (!cascadeData) {
    return <CascadeSkeleton />;
  }

  const content = (
    <>
      <div
        id="svg-tree"
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          ...cascadeDefaultOptions.canvasStyle,
        }}
      ></div>
      <DuftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={cascadeTitle}
        resize={resize}
      >
        <DataProvider value={{ data: modalCascadeData }}>
          <InfiniteScrollTable
            initialColumns={modalCascadeHeadLabels.join(",")}
            exportData={false}
            container={CardComponent}
            variant="plain"
          />
        </DataProvider>
      </DuftModal>
    </>
  );

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      infoTagContent={getInfoTagContents(children)}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default CascadeChart;
