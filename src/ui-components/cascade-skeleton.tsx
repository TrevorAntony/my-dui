import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CascadeSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="mr-10 flex flex-col items-center">
        <Skeleton height={40} width={100} />
      </div>

      <div className="flex flex-col items-center">
        <Skeleton height={30} width={80} className="mb-2" />
        <Skeleton height={30} width={80} />
      </div>

      <div className="ml-10 flex flex-col items-center">
        <Skeleton height={40} width={100} />
      </div>
    </div>
  );
};

export default CascadeSkeleton;
