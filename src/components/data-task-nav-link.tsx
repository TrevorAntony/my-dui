import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import { executeDataTask } from "../helpers/data-task-helpers";
import type { DataTaskItem } from "./types";
import DataTaskDialog from "./data-task-dialog";

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
    if (result?.message) {
      setIsOpen(false);
    } else {
      setError("Data task operation failed.");
    }
  };

  return (
    <>
      <Sidebar.Item
        as="div"
        icon={Icon}
        onClick={handleClick}
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {task.title}
      </Sidebar.Item>

      <DataTaskDialog
        isOpen={isOpen}
        onClose={handleClose}
        onExecute={handleExecute}
        title={task.title}
        executeButtonText="Execute"
        cancelButtonText="Cancel"
      >
        <p>Are you sure?</p>
        {error && <p className="text-red-600">{error}</p>}
      </DataTaskDialog>
    </>
  );
};