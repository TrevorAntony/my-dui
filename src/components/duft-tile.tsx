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
    data[0] &&
    data[0].hasOwnProperty("value");

  if (!isValidData) {
    return <div>No valid data available</div>;
  }

  console.log(data);
  const tileData = data[0].value;

  const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    marginBottom: "5px",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  return (
    <div className="flex h-auto flex-col justify-between rounded-lg bg-white p-3 shadow dark:bg-gray-800 sm:p-4 xl:p-5">
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{tileData}</div>
    </div>
  );
};

export default DuftTile;
