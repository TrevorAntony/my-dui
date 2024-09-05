import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useThemeContext } from "../utilities/Dashboard";
import ApexTree from 'apextree';
import fetchCascade from "../../helpers/cascade-helpers";

// Default options for ApexTree
const defaultOptions = {
    contentKey: 'data',
    width: '100%',
    height: '100%',
    nodeWidth: 900,
    nodeHeight: 300,
    childrenSpacing: 200,
    siblingSpacing: 100,
    fontSize: '20px',
    fontWeight: 300,
    fontColor: 'black',
    borderWidth: 2,
    borderColorHover: '#b0decb',
    nodeBGColorHover: '#b0decb',
    nodeBGColor: "#eff8f4",
    highlightOnHover: true,
    enableExpandCollapse: false,
    direction: "left",
    enableToolbar: false,
    canvasStyle: {
        background: 'white',
    },
    nodeTemplate: (node) => {
        const { label, value } = node;
        const formattedValue = Number(value).toLocaleString();
        if (!value || !label) {
            return '';
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
    ...props
}) => {
    const theme = useThemeContext(); // Accessing the theme context
    const [cascadeData, setCascadeData] = useState(null);

    const cascade = useMemo(() => ({
        id: "1",
        data: {
            label: "Number of Total Clients",
            query: "SELECT client_id , birth_date , current_age , gender , marital_status FROM dim_client LIMIT 100"
        },
        children: [
            {
                id: "11",
                data: {
                    label: "Number of Female Clients",
                    query: "SELECT client_id , birth_date , current_age , gender , marital_status FROM dim_client where gender = 'Female' LIMIT 60"
                },
                options: {
                    nodeBGColorHover: "#dc7c74",
                    borderColorHover: "#dc7c74",
                    nodeBGColor: "#ffe5df"
                }
            },
            {
                id: "2",
                data: {
                    label: "Number of Male Clients",
                    query: "SELECT client_id , birth_date , current_age , gender , marital_status FROM dim_client where gender = 'Male' LIMIT 40"
                }
            }
        ]
    }), []);

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
                    value: queryResult.length
                }
            };

            if (node.children && node.children.length > 0) {
                const childResults = await Promise.allSettled(node.children.map(processNode));

                result.children = childResults.map((childResult, index) => {
                    if (childResult.status === "fulfilled") {
                        return childResult.value;
                    } else {
                        console.error(`Error processing child node ${node.children[index].id}:`, childResult.reason);
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
                                value: 0
                            }
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

        const svgElement = document.getElementById('svg-tree');
        if (!svgElement) {
            console.error("Element with id 'svg-tree' not found");
            return;
        }

        const tree = new ApexTree(svgElement, defaultOptions);
        tree.render(cascadeData);

        return () => {
            if (tree && typeof tree.destroy === 'function') {
                tree.destroy();
            } else {
                svgElement.innerHTML = '';
            }
        };
    }, [cascadeData]);

    if (!cascadeData) {
        return <div>Loading data...</div>;
    }

    const content = (
        <div id="svg-tree" style={{ width: "100%", maxWidth: "100%", height: "auto", ...defaultOptions.canvasStyle }}></div>
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
