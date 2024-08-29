import React from "react";
import { MantineReactTable } from 'mantine-react-table';
import { Box } from '@mantine/core';
import { useDataContext } from "../utilities/DataContainer";
import { useLayout } from "../utilities/Dashboard";

const ScoreCardTable = ({
    container: ContainerComponent,
    header = "Score Card Table",
    subHeader = header,
    ...props
}) => {
    const data = useDataContext();
    const layout = useLayout();

    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>;
    }

    // Generate columns from data keys
    const columns = Object.keys(data[0]).map((key) => {
        if (key === 'score') {
            return {
                accessorKey: key,
                header: 'Score',
                size: 150,
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',
                },
                Cell: ({ cell }) => {
                    const score = cell.getValue() / 100; // Convert score to a percentage
                    return (
                        <Box
                            sx={{
                                backgroundColor:
                                    score < 0.5
                                        ? '#FBE5DF' // Red
                                        : score >= 0.5 && score < 0.75
                                            ? '#FDF3D9' // Yellow
                                            : '#DBF0E7', // Green
                                borderRadius: '4px',
                                color: '#000',
                                maxWidth: '9ch',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            {score?.toLocaleString?.('en-US', {
                                style: 'percent',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </Box>
                    );
                },
            };
        } else {
            return {
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
                size: 150,
            };
        }
    });

    const content = (
        <div
            style={{
                height: "400px",
                overflow: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                width: layout === "single-layout" ? "100%" : "auto"
            }}
        >
            <MantineReactTable
                columns={columns}
                enableStickyHeader
                data={data}
                enableGlobalFilter={false}
                enablePagination={false}
                enableRowSelection={false}
                enableColumnFilterModes={true}
                enableColumnOrdering={true}
                enableFacetedValues={true}
                {...props}
            />
        </div>
    );

    return layout === "single-layout" ? (
        content
    ) : ContainerComponent ? (
        <ContainerComponent header={header} subHeader={subHeader}>
            {content}
        </ContainerComponent>
    ) : (
        content
    );
};

export default ScoreCardTable;
