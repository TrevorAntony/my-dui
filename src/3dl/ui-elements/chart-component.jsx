import React from "react";

const ChartComponent = ({ header, children }) => {
  const styles = {
    chartContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      margin: "1rem",
    },
    header: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "12px",
      color: "#333",
    },
  };

  return (
    <div style={styles.chartContainer}>
      {header && <div style={styles.header}>{header}</div>}
      {children}
    </div>
  );
};

export default ChartComponent;
