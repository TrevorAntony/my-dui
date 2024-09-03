import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";

const DataRefresh: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDataTask = async () => {
    const url = "http://127.0.0.1:8000/api/v2/run-data-task";
    const payload = {
      data_task_id: "SAMPLE-NOTEBOOK",
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
    <div>
      <Modal show={isOpen} onClose={toggleModal}>
        <Modal.Header>Data Refresh</Modal.Header>
        <Modal.Body>
          <p>Do you want to refresh the data?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDataTask} color="pink">
            Yes, Refresh Data
          </Button>
          <Button onClick={toggleModal} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataRefresh;
