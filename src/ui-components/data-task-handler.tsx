import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DuftModal from "../components/duft-modal";
import type { DataTask } from "../types/data-task";
import { executeDataTask } from "../helpers/data-task-helpers";
import { useSidebarConfigContext } from "../3dl/context/SidebarConfigContext";

const DataTaskHandler: React.FC = () => {
  const sidebarConfig = useSidebarConfigContext();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const activeDataTask = sidebarConfig.system.dataTasks.items?.find(
    (taskItem: DataTask) => taskItem.task === id
  ) as DataTask | undefined;

  const {
    title = "Execute Task",
    prompt = "Are you sure?",
    executeButtonText = "Execute",
    cancelButtonText = "Cancel",
  } = activeDataTask || {};

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(null);
    window.location.reload();
  };

  const handleDataTask = async () => {
    const result = await executeDataTask(id || "");

    if (result.message.includes("Script started successfully")) {
      setIsOpen(false);
    } else {
      setError("Unknown error occurred.");
    }
  };

  return (
    <DuftModal
      isOpen={isOpen}
      onClose={toggleModal}
      onExecute={handleDataTask}
      title={title}
      executeButtonText={executeButtonText}
      modalWidth="narrow"
      modalHeight="tiny"
      cancelButtonText={cancelButtonText}
      resize="false"
    >
      <p>{prompt}</p>
      {error && <p className="text-red-600">{error}</p>}{" "}
    </DuftModal>
  );
};

export default DataTaskHandler;
