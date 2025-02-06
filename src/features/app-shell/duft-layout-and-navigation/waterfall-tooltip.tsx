import React from "react";

interface TooltipProps {
  message: string;
}

const WaterFallTooltip: React.FC<TooltipProps> = ({ message }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.85)",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "6px",
        whiteSpace: "nowrap",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        transition: "opacity 0.3s ease-in-out",
        opacity: 1,
        pointerEvents: "none",
        fontSize: "14px",
        fontWeight: "bold",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default WaterFallTooltip;
