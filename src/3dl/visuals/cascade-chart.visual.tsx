/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect, useCallback } from "react";
// import { useThemeContext } from "../utilities/Dashboard";
import ApexTree from "apextree";
import { MantineReactTable } from "mantine-react-table";
import fetchCascade from "../../helpers/cascade-helpers";
import DuftModal from "../../components/duft-modal";
import CascadeSkeleton from "../../ui-components/cascade-skeleton";
import type { ContainerComponentProps } from "../types/types";

// Default options for ApexTree
const defaultOptions = {
  contentKey: "data",
  width: "100%",
  height: "100%",
  nodeWidth: 900,
  nodeHeight: 300,
  childrenSpacing: 200,
  siblingSpacing: 100,
  fontSize: "20px",
  fontWeight: 300,
  fontColor: "black",
  borderWidth: 2,
  borderColorHover: "#b0decb",
  nodeBGColorHover: "#b0decb",
  nodeBGColor: "#eff8f4",
  highlightOnHover: true,
  enableExpandCollapse: false,
  direction: "left",
  enableToolbar: false,
  canvasStyle: {
    background: "white",
  },
  nodeTemplate: (node: Record<string, unknown>) => {
    const { label, value } = node;
    const formattedValue = Number(value).toLocaleString();
    if (!value || !label) {
      return "";
    }

    return `
      <div 
      id=${node["id"]}
        style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 100%;
        padding-left: 5%;
        cursor: pointer;
      "
      >
        <div style="font-size: 3.5em; line-height: 1.50; font-weight: 700">${formattedValue}</div>
        <div style="font-size: 1.8em;">${node["label"]}</div>
      </div>
    `;
  },
};

// Define a type for the results
type CascadeDataType = {
  id: string;
  options: any;
  data: any;
  children?: any;
};

const CascadeChart = ({
  container: Container,
  header,
  subHeader = "",
  cascadeObject,
  exportData,
  detailsComponent,
  ...props
}: {
  container: React.ComponentType<ContainerComponentProps>;
  header: string;
  subHeader: string;
  cascadeObject: Record<string, unknown>;
  exportData: string;
  detailsComponent: string;
}) => {
  // const theme = useThemeContext(); // Accessing the theme context
  const [cascadeData, setCascadeData] = useState<CascadeDataType | null>(null);
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
        const queryResult = await fetchCascade(query);
        const result: CascadeDataType = {
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
                (childResult as { reason: string }).reason, // Type assertion added
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
                  // label: (
                  //   node["children"] as Array<{ data: { label: string } }>
                  // )?.[index]?.data.label,
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
        // setCascadeData(null);
        const results: CascadeDataType = await processNode(dataStructure);
        setCascadeData(results);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    },
    [],
  );

  useEffect(() => {
    fetchCascadeData(cascade);
  }, [cascade, fetchCascadeData]);

  useEffect(() => {
    if (!cascadeData) return;

    const svgElement = document.getElementById("svg-tree");
    if (!svgElement) {
      console.error("Element with id 'svg-tree' not found");
      return;
    }

    const tree = new ApexTree(svgElement, defaultOptions);
    tree.render(cascadeData);

    const toggleModal = (label, details, headLabels) => {
      setModalCascadeData(details);
      setCascadeTitle(label);
      setModalCascadeHeadLabels(headLabels);
      setIsModalOpen(!isModalOpen);
    };

    const transformHeadLabel = (arr) =>
      arr.map((column) => ({
        accessorKey: column,
        header: column,
        size: 150,
      }));

    // Function to traverse nodes recursively
    const traverseNodes = (node) => {
      const { id, label, details } = node.data;

      const headLabels = details.length > 0 ? Object.keys(details[0]) : [];

      const transformedHeadLabels = transformHeadLabel(headLabels);

      const nodeElement = document.getElementById(id);
      if (nodeElement) {
        nodeElement.addEventListener("click", () => {
          toggleModal(label, details, transformedHeadLabels);
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverseNodes(child));
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
  }, [cascadeData]);

  if (!cascadeData) {
    return <div>Loading data...</div>;
  }
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
          ...defaultOptions.canvasStyle,
        }}
      ></div>
      <DuftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={cascadeTitle}
      >
        {/* TO:DO replace this table with the InfiniteScrollTable */}
        <MantineReactTable
          columns={modalCascadeHeadLabels}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableStickyHeader
          data={modalCascadeData}
          enableGlobalFilter
          enablePagination={false}
          initialState={{ pagination: { pageSize: 10, pageIndex: 0 } }}
          {...props}
          mantineTableContainerProps={{ sx: { maxHeight: "300px" } }}
        />
      </DuftModal>
    </>
  );

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default CascadeChart;
