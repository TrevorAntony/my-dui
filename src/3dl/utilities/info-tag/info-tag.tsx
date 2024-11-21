import React from "react";
import { Tooltip } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import type { VisualProps } from "../../../types/visual-props";

const InfoTag = ({ children }: VisualProps) => {
  const markdown = React.useMemo(() => {
    return children;
  }, [children]);

  return (
    <Tooltip content={markdown} placement="top" trigger="hover">
      <button type="button" className="p-1">
        <HiInformationCircle className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </button>
    </Tooltip>
  );
};

export default InfoTag;
