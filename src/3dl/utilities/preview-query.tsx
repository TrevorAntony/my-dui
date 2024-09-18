import React, { useState, useRef } from "react";
import { useQueryContext } from "../context/QueryContext";
import DataTable from "../tables/DataTable"; // Import your DataTable component
import PivotTable from "../tables/PivotTable"; // Import your PivotTable component

interface PreviewQueryProps {
  children?: React.ReactElement<{ query?: string }>;
  container?: React.ComponentType<{ children: React.ReactNode }>;
}

const PreviewQuery: React.FC<PreviewQueryProps> = ({
  children,
  container: Container,
}) => {
  const [viewMode, setViewMode] = useState<"dataTable" | "pivotTable">(
    "dataTable"
  );
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const { setQuery } = useQueryContext();

  const handleUpdateQuery = () => {
    const queryValue = queryRef.current?.value;
    if (queryValue) {
      setQuery(queryValue);
    }
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: "20px",
      }}
    >
      <textarea
        ref={queryRef}
        placeholder="Type your query here..."
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid black",
          resize: "none",
          marginBottom: "10px",
          outline: "none",
        }}
      />
      <button
        onClick={handleUpdateQuery}
        style={{
          alignSelf: "flex-end",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          backgroundColor: "#C42783",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Update Query
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginTop: "20px",
          width: "100%",
        }}
      >
        {/* Radio buttons on the left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
            gap: "10px", // Adds spacing between the radio buttons
          }}
        >
          <label>
            <input
              type="radio"
              name="viewMode"
              value="dataTable"
              checked={viewMode === "dataTable"}
              onChange={() => setViewMode("dataTable")}
            />
            Data Table
          </label>
          <label>
            <input
              type="radio"
              name="viewMode"
              value="pivotTable"
              checked={viewMode === "pivotTable"}
              onChange={() => setViewMode("pivotTable")}
            />
            Pivot Table
          </label>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowX: "auto" }}>
          {viewMode === "dataTable" ? (
            <div
              style={{
                width: "100%", // Ensure the table fits within the parent
                overflowX: "auto", // Make it scrollable if it overflows
              }}
            >
              <DataTable />
            </div>
          ) : (
            <PivotTable />
          )}
        </div>
      </div>

      {children}
    </div>
  );

  return Container ? <Container>{content}</Container> : content;
};

export default PreviewQuery;
