import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChartSkeleton = () => {
  const isDarkMode = localStorage.getItem("flowbite-theme-mode") === "dark";

  return (
    <div>
      <Skeleton
        height={300}
        width="100%"
        baseColor={isDarkMode ? "#4B5563" : "#F9FAFB"}
        highlightColor={isDarkMode ? "#6B7280" : "#F3F4F6"}
      />
    </div>
  );
};

export default ChartSkeleton;
