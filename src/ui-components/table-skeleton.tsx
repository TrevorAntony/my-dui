import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <div className="mb-4 grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} height={30} width="100%" />
        ))}
      </div>

      {Array.from({ length: 5 }, (_, rowIndex) => (
        <div key={rowIndex} className="mb-2 grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }, (_, colIndex) => (
            <Skeleton key={colIndex} height={20} width="100%" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
