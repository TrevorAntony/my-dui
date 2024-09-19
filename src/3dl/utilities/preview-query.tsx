import React, { useState, useRef } from "react";
import { useDataContext } from "../context/DataContext";
import DataTable from "../tables/DataTable";
import PivotTable from "../tables/PivotTable";

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

  const { query, setQuery } = useDataContext();

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
        placeholder={query}
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
          fontSize: "13px",
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
            gap: "10px",
          }}
        >
          <CustomRadioButton
            label="Data Table"
            value="dataTable"
            isSelected={viewMode === "dataTable"}
            onChange={() => setViewMode("dataTable")}
          />
          <CustomRadioButton
            label="Pivot Table"
            value="pivotTable"
            isSelected={viewMode === "pivotTable"}
            onChange={() => setViewMode("pivotTable")}
          />
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowX: "auto" }}>
          {viewMode === "dataTable" ? (
            <div
              style={{
                width: "100%",
                overflowX: "auto",
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

interface CustomRadioButtonProps {
  label: string;
  value: string;
  isSelected: boolean;
  onChange: () => void;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  label,
  value,
  isSelected,
  onChange,
}) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: "#333",
      }}
    >
      <input
        type="radio"
        name="viewMode"
        value={value}
        checked={isSelected}
        onChange={onChange}
        className=" text-highlight-600 focus:ring-2 focus:ring-highlight-600"
        style={{
          marginRight: "10px",
          accentColor: "#C42783",
        }}
      />
      {label}
    </label>
  );
};
