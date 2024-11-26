import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import DuftModal from "./duft-modal";
import { executeDataTask } from "../helpers/data-task-helpers";
import type { DataTaskItem } from "./types";

type DataTaskNavLinkProps = {
  task: DataTaskItem;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const DataTaskNavLink: React.FC<DataTaskNavLinkProps> = ({
  task,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleExecute = async () => {
    const result = await executeDataTask(task.task);
    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || "Unknown error occurred.");
    }
  };

  return (
    <>
      <Sidebar.Item as="div" icon={Icon} onClick={handleClick}>
        {task.title}
      </Sidebar.Item>

      <DuftModal
        isOpen={isOpen}
        onClose={handleClose}
        onExecute={handleExecute}
        title={task.title}
        executeButtonText="Execute"
        modalWidth="narrow"
        modalHeight="tiny"
        cancelButtonText="Cancel"
        resize="false"
      >
        <p>Are you sure?</p>
        {error && <p className="text-red-600">{error}</p>}
      </DuftModal>
    </>
  );
};
