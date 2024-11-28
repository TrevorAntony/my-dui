import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useThemeMode } from "../context/ThemeModeContext";

const ChartSkeleton = () => {
  const { mode } = useThemeMode();
  const isDarkMode = mode === "dark";

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
