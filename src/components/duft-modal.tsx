import React from "react";
import { Modal, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { renderModalContent } from "../helpers/modalContentHelper"; // Import the helper function

// Define the custom size mapping
const modalSizeMap = {
  small: "3xl",
  medium: "7xl",
  large: "full",
};

interface DuftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute?: () => void; // Optional execution button click function
  executeButtonName?: string; // Name for the execution button
  title?: string;
  children?: React.ReactNode;
  modalContent?: string | string[] | Record<string, any>; // Accept string, array, or object
  hideFooter?: boolean; // Flag to hide the footer when needed
  isScriptCompleted?: boolean; // Whether the script is completed
  handleButtonClose?: () => void; // Optional function to handle close button
  modalSize?: "small" | "medium" | "large"; // Use custom modal size prop
}

const DuftModal: React.FC<DuftModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonName,
  title,
  children,
  modalContent,
  hideFooter = false, // Default to false if no value is provided
  isScriptCompleted = false, // Default to false if no value is provided
  handleButtonClose,
  modalSize = "small", // Default to small if no modalSize is provided
}) => {
  // Map custom modalSize values (small, medium, large) to actual Flowbite sizes
  const resolvedModalSize =
    modalSizeMap[modalSize as keyof typeof modalSizeMap];

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size={resolvedModalSize} // Use the mapped size dynamically
      className="relative"
      style={{
        width: "100%",
        height: "auto",
        overflowY: "auto", // Enable scroll for overflowing content
        overflowX: "auto", // Enable horizontal scrolling if necessary
      }}
    >
      {/* Header with dynamic title */}
      <div className="relative flex justify-between p-4 text-lg font-semibold">
        <span>{title || "More info"}</span>
        {/* X button using HiX icon */}
        <button
          type="button"
          className="absolute right-0 top-0 m-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <HiX className="h-6 w-6" />
        </button>
      </div>

      {/* Body content: dynamic children or modalContent */}
      <Modal.Body
        className="space-y-6"
        style={{
          maxHeight: "calc(100vh - 150px)", // Handle scroll by limiting the body height
          overflowY: "auto", // Enable vertical scrolling if content exceeds
          overflowX: "auto", // Enable horizontal scrolling if necessary
        }}
      >
        {children ? (
          <div>{children}</div>
        ) : modalContent ? (
          renderModalContent(modalContent) // Use the imported helper function
        ) : null}
      </Modal.Body>

      {/* Conditionally render the Footer based on task status */}
      {!hideFooter && (
        <Modal.Footer className="flex justify-end">
          {/* Only show the Close button when the script is completed */}
          {isScriptCompleted && (
            <Button color="primary" onClick={handleButtonClose || onClose}>
              Close
            </Button>
          )}

          {/* Show both Close and Execute buttons before the script starts */}
          {!hideFooter && !isScriptCompleted && (
            <>
              <Button color="primary" onClick={handleButtonClose || onClose}>
                Close
              </Button>
              {executeButtonName && onExecute && (
                <Button color="pink" onClick={onExecute}>
                  {executeButtonName || "Run"}
                </Button>
              )}
            </>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default DuftModal;
