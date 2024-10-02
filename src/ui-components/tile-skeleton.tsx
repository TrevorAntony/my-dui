import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TileSkeleton = () => {
  return (
    <div>
      <Skeleton height={30} width="75%" />
      <div style={{ height: "15px" }}></div>
      <Skeleton count={2} />
    </div>
  );
};

export default TileSkeleton;
