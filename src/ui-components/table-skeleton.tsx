import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableSkeleton: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(
    document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  
  return (
    <div className="w-full">
      <div className="mb-4 grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton 
            key={index} 
            height={30} 
            width="100%" 
            baseColor={isDarkMode ? "#4B5563" : "#F9FAFB"}
            highlightColor={isDarkMode ? "#6B7280" : "#F3F4F6"}
          />
        ))}
      </div>

      {Array.from({ length: 5 }, (_, rowIndex) => (
        <div key={rowIndex} className="mb-2 grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }, (_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              height={20} 
              width="100%" 
              baseColor={isDarkMode ? "#4B5563" : "#F9FAFB"}
              highlightColor={isDarkMode ? "#6B7280" : "#F3F4F6"}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;