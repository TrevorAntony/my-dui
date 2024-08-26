import React from "react";
import { useDataContext } from "../utilities/DataContainer";

const Tile = ({ label }) => {
  const data = useDataContext();

  return (
    <div style={styles.tileContainer}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{data[0].value}</div>
    </div>
  );
};

const styles = {
  tileContainer: {
    border: "2px solid #FF00FF", // Magenta border
    borderRadius: "8px",
    padding: "10px 20px",
    backgroundColor: "#FFF0F5", // Light magenta background
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    margin: "10px",
    maxWidth: "200px",
  },
  label: {
    fontSize: "14px",
    color: "#800080", // Dark magenta color for label
    marginBottom: "5px",
  },
  value: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#FF00FF", // Magenta color for value
  },
};

export default Tile;
