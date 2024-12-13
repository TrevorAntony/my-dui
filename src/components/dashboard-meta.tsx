import { useDataContext } from "../3dl/context/DataContext";
import React from "react";

interface DataStringProps {
  children: React.ReactNode;
}

const DataString: React.FC<DataStringProps> = ({ children }) => {
  const { data } = useDataContext();

  const handlePlaceholderReplacement = (text: string): string => {
    if (Array.isArray(data) && data.length > 0) {
      return text.replace(
        /%(\w+)%/g,
        (match: string, key: string) => data[0][key] || match
      );
    }
    return text;
  };

  const replacePlaceholders = (child: React.ReactNode): React.ReactNode => {
    if (typeof child === "string") {
      return handlePlaceholderReplacement(child);
    }

    if (typeof child === "object" && child !== null && "props" in child) {
      if (typeof child.props.children === "string") {
        return {
          ...child,
          props: {
            ...child.props,
            children: handlePlaceholderReplacement(child.props.children),
          },
        };
      }
      return child;
    }
    return child;
  };

  return (
    <>{React.Children.map(children, (child) => replacePlaceholders(child))}</>
  );
};

export default DataString;
