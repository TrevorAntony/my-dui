import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import { Button } from "flowbite-react";
import DuftModal from "../components/duft-modal"; // Ensure the path is correct

const FreeQuery: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Get the data task ID from the URL parameters
  const { id } = useParams<{ id: string }>();

  const toggleModal = () => {
    setIsOpen(!isOpen);
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

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Data task result:", result);

      // Close the modal after the task is complete
      setIsOpen(false);
    } catch (error) {
      console.error("There was an error running the data task:", error);
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
    </DuftModal>
  );
};

export default FreeQuery;
