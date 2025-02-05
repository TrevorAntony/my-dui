import React from "react";
import { Popover } from "flowbite-react";
import type { VisualProps } from "../../types/visual-props";
import { AiOutlineInfoCircle } from "react-icons/ai";

const InfoTag = ({ children }: VisualProps) => {
  const markdown = React.useMemo(() => {
    return children;
  }, [children]);

  return (
    <Popover
      content={
        <div className="max-h-[80vh] max-w-[90vw] overflow-auto p-4 md:max-h-[500px] md:max-w-[600px]">
          {markdown}
        </div>
      }
      placement="top"
      trigger="hover"
    >
      <button type="button" className="pl-2 pt-[2.5px] dark:text-highlight-500">
        <AiOutlineInfoCircle
          className="h-6 w-6 text-gray-400 hover:text-gray-600"
          size={20}
        />
      </button>
    </Popover>
  );
};

export default InfoTag;
