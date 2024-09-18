import React from "react";
import { useDataContext } from "../context/DataContext";

// Visual5 component implementing a basic data tile
const Visual5 = ({ title, backgroundColor = "#f0f0f0", color = "#333" }) => {
  const { data } = useDataContext();

  // Define the style for the data tile
  const tileStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
    height: "100px",
    margin: "10px",
    borderRadius: "8px",
    backgroundColor, // Use background color prop
    color, // Use color prop for text
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontSize: "16px",
    marginBottom: "5px",
  };

  const valueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  return (
    <div style={tileStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{data}</div>
    </div>
  );
};

export default Visual5;
