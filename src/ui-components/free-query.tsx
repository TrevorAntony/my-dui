import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DuftModal from "../components/duft-modal"; // Ensure the path is correct

const FreeQuery: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // State to store error message

  // Get the data task ID from the URL parameters
  const { id } = useParams<{ id: string }>();

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(null); // Reset error when closing the modal
    window.location.href = "/";
  };

  const handleDataTask = async () => {
    const url = "http://127.0.0.1:8000/api/v2/run-data-task";
    const payload = {
      data_task_id: id, // Use the ID from the URL params
      parameters: {
        additionalProp1: "string",
        additionalProp2: "string",
        additionalProp3: "string",
      },
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
        const result = await response.json();
        console.log("Data task result:", result);

        // Close the modal after the task is complete and status is 202
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
    >
      <p>Do you want to refresh the data?</p>
      {error && <p className="text-red-600">{error}</p>}{" "}
      {/* Conditionally render error */}
    </DuftModal>
  );
};

export default FreeQuery;
