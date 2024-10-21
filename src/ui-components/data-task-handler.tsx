import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DuftModal from "../components/duft-modal";
import { useSidebarConfig } from "../hooks/useSideBarConfig";
import type { DataTask } from "../types/data-task";
import { executeDataTask } from "../helpers/data-task-helpers";

const DataTaskHandler: React.FC = () => {
  const { sidebarConfig } = useSidebarConfig();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();

  const activeDataTask = sidebarConfig.system.dataTasks.find(
    (taskItem: DataTask) => taskItem.task === id,
  ) as DataTask | undefined;

  const {
    title = "Execute Task",
    prompt = "Are you sure?",
    buttonName = "Execute",
  } = activeDataTask || {};

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(null);
    window.location.href = "/dashboard/home";
  };

  const handleDataTask = async () => {
    const result = await executeDataTask(id || "");
    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || "Unknown error occurred.");
    }
  };

  return (
    <DuftModal
      isOpen={isOpen}
      onClose={toggleModal}
      onExecute={handleDataTask}
      title={title}
      executeButtonName={buttonName}
      modalWidth="narrow"
    >
      <p>{prompt}</p>
      {error && <p className="text-red-600">{error}</p>}{" "}
    </DuftModal>
  );
};

export default DataTaskHandler;
