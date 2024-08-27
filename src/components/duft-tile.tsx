import React from "react";
import { useDataContext } from "../3dl/utilities/DataContainer";

interface DuftTileProps {
  title: string;
  backgroundColor?: string;
  color?: string;
}

const DuftTile: React.FC<DuftTileProps> = ({ title }) => {
  const data = useDataContext();

  // Defensive checks for data
  const isValidData =
    data &&
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object";

  if (!isValidData) {
    return <div>No valid data available</div>;
  }

  const [firstKey, secondKey] = Object.keys(data[0]);
  const firstValue = data[0][firstKey];
  const secondValue = data[0][secondKey];

  console.log({ firstKey, secondKey });
  const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    marginBottom: "5px",
  };

  const valueContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  const secondaryValueStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#A9A9A9", // Lighter gray color for secondary value
  };

  return (
    <div className="flex h-auto flex-col justify-between rounded-lg bg-white p-3 shadow dark:bg-gray-800 sm:p-4 xl:p-5">
      <div style={titleStyle}>{title}</div>
      <div style={valueContainerStyle}>
        <div style={valueStyle}>{firstValue}</div>
        <div style={secondaryValueStyle}>{secondValue || "N/A"}</div>
      </div>
    </div>
  );
};

export default DuftTile;
