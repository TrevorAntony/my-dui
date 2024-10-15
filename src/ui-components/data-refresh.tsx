import React, { useState } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import DuftModal from "../components/duft-modal";

const DataRefresh: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the data task ID from the URL parameters
  const { id } = useParams<{ id: string }>();

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(null);
    window.location.href = "/dashboard/home";
  };

  const handleDataTask = async () => {
    const url = `${config.apiBaseUrl}/run-data-task`;
    const payload = {
      data_task_id: id,
      parameters: {},
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 202) {
        setIsOpen(false);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("There was an error running the data task:", error);
      setError("There was an error running the data task. Please try again."); // Set error message
    }
  };

  return (
    <DuftModal
      isOpen={isOpen}
      onClose={toggleModal}
      onExecute={handleDataTask}
      title="Data Refresh"
      executeButtonName="Run data task"
      modalWidth="narrow"
      closeButtonLabel="Cancel"
    >
      <p>Do you want to refresh the data?</p>
      {error && <p className="text-red-600">{error}</p>}{" "}
    </DuftModal>
  );
};

export default DataRefresh;
