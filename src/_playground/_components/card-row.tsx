import React, { type FC, type ReactNode } from "react";

type CardRowProps = {
  children: ReactNode;
  columns?: number;
};

const CardRow: FC<CardRowProps> = ({ children, columns = 2 }) => {
  let gridClass;

  switch (columns) {
    case 1:
      gridClass = "grid-cols-1";
      break;
    case 2:
      gridClass = "grid-cols-1 md:grid-cols-2";
      break;
    case 3:
      gridClass = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
      break;
    case 4:
      gridClass = "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";
      break;
    default:
      gridClass = "grid-cols-1 md:grid-cols-2";
  }

  return (
    <div className={`grid w-full gap-4 ${gridClass} mt-4 first:mt-0`}>
      {React.Children.map(children, (child) => (
        <div className="h-full">{child}</div>
      ))}
    </div>
  );
};

export default CardRow;
