import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useThemeContext } from "../utilities/Dashboard";
import ApexTree from "apextree";
import { MantineReactTable } from "mantine-react-table";
import fetchCascade from "../../helpers/cascade-helpers";
import DuftModal from "../../components/duft-modal";
import CascadeSkeleton from "../../ui-components/cascade-skeleton";

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
  nodeTemplate: (node) => {
    const { label, value } = node;
    const formattedValue = Number(value).toLocaleString();
    if (!value || !label) {
      return "";
    }

    return `
      <div 
      id=${node.id}
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
        <div style="font-size: 1.8em;">${node.label}</div>
      </div>
    `;
  },
};

const CascadeChart = ({
  container: Container,
  header,
  subHeader = "",
  cascadeObject,
  ...props
}) => {
  const theme = useThemeContext(); // Accessing the theme context
  const [cascadeData, setCascadeData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cascadeTitle, setCascadeTitle] = useState("");
  const [modalCascadeHeadLabels, setModalCascadeHeadLabels] = useState([]);
  const [modalCascadeData, setModalCascadeData] = useState([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const cascade = useMemo(() => cascadeObject, [cascadeObject]);

  const fetchCascadeData = useCallback(async (dataStructure) => {
    async function processNode(node) {
      const { query } = node.data;
      const queryResult = await fetchCascade(query);
      const result = {
        id: node.id,
        options: node.options ? node.options : [],
        data: {
          id: node.id,
          label: node.data.label,
          details: queryResult,
          value: queryResult.length,
        },
      };

      if (node.children && node.children.length > 0) {
        const childResults = await Promise.allSettled(
          node.children.map(processNode),
        );

        result.children = childResults.map((childResult, index) => {
          if (childResult.status === "fulfilled") {
            return childResult.value;
          } else {
            console.error(
              `Error processing child node ${node.children[index].id}:`,
              childResult.reason,
            );
            return {
              id: node.children[index].id,
              error: true,
              message: "Failed to fetch data",
              children: [],
              options: [],
              data: {
                id: node.children[index].id,
                label: node.children[index].data.label,
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
      const results = await processNode(dataStructure);
      setCascadeData(results);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);

  useEffect(() => {
    fetchCascadeData(cascade);
  }, [cascade, fetchCascadeData]); // Only run when `cascade` changes

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
        widthSize="large"
        heightSize="large"
        isCloseDefault={true}
      >
        <MantineReactTable
          columns={modalCascadeHeadLabels}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableStickyHeader
          data={modalCascadeData}
          enableGlobalFilter
          enablePagination={false}
          initialState={{ pagination: { pageSize: 10 } }}
          {...props}
          mantineTableContainerProps={{ sx: { maxHeight: "300px" } }}
        />
      </DuftModal>
    </>
  );

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default CascadeChart;
