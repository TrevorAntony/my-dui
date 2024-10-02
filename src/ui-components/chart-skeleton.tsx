import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChartSkeleton = () => {
  return (
    <div>
      <Skeleton height={300} width="100%" />
    </div>
  );
};

export default ChartSkeleton;
