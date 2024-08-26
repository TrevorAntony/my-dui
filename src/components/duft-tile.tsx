import React from "react";

interface DuftTileProps {
  title: string;
  data: string | number;
  backgroundColor?: string;
  color?: string;
}

const DuftTile: React.FC<DuftTileProps> = ({ title, data }) => {
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
      <div style={valueStyle}>{data}</div>
    </div>
  );
};

export default DuftTile;
