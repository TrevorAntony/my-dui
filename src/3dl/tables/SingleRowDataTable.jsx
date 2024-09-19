import React from "react";
import { useDataContext } from "../context/DataContext";
import { useLayout } from "../ui-elements/single-layout";
import { transposeData } from "../../helpers/visual-helpers";

const SingleRowDataTable = ({
    container: ContainerComponent,
    header,
    subHeader = "",
    variant = "card",
}) => {
    const { data } = useDataContext();
    const layout = useLayout();

    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>;
    }

    const transposedData = transposeData(data);

    const content = (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
                <tr>
                    <th
                        style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                            backgroundColor: "#f2f2f2",
                        }}
                    >
                        Column
                    </th>
                    {data.map((_, index) => (
                        <th
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                backgroundColor: "#f2f2f2",
                            }}
                        >
                            Value
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {transposedData.map((row, index) => (
                    <tr key={index}>
                        <td
                            style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            {row.name.charAt(0).toUpperCase() + row.name.slice(1)}
                        </td>
                        {row.values.map((value, idx) => (
                            <td
                                key={idx}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {value}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const wrappedContent =
        layout === "single-layout" ? (
            <div className="block w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
                {content}
            </div>
        ) : (
            content
        );

    return ContainerComponent && layout !== "single-layout" ? (
        <ContainerComponent header={header} subHeader={subHeader} variant={variant}>
            {wrappedContent}
        </ContainerComponent>
    ) : (
        wrappedContent
    );
};

export default SingleRowDataTable;
