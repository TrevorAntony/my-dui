import React from "react";
import { Modal, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { renderModalContent } from "../helpers/modalContentHelper";

// Mapping modal width to Flowbite size classes
const modalWidthMap = {
  narrow: "3xl", // Smallest width
  medium: "7xl",
  wide: "full",
};

// Mapping modal height to CSS height values
const modalHeightMap = {
  small: "30vh", // Small height (30% of viewport height)
  medium: "60vh", // Medium height (60% of viewport height)
  large: "80vh", // Large height (80% of viewport height)
};

interface DuftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute?: () => void;
  executeButtonName?: string;
  title?: string;
  children?: React.ReactNode;
  modalContent?: string | string[] | Record<string, any>;
  hideButtons?: boolean;
  showExecuteButton?: boolean;
  handleButtonClose?: () => void;
  modalWidth?: keyof typeof modalWidthMap;
  modalHeight?: keyof typeof modalHeightMap;
  miniWidth?: string; // Optional fixed width (e.g., "500px", "50vw")
  miniHeight?: string; // Optional fixed height (e.g., "500px", "50vh")
}

const DuftModal: React.FC<DuftModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonName = "Run",
  title = "More info",
  children,
  modalContent,
  hideButtons = false,
  showExecuteButton = false,
  handleButtonClose,
  modalWidth, // Allow undefined for default handling
  modalHeight, // Allow undefined for default handling
  miniWidth, // Optional prop for fixed width
  miniHeight, // Optional prop for fixed height
}) => {
  // Determine default width (narrow) and height (large) if not specified
  const resolvedModalWidth = modalWidth
    ? modalWidthMap[modalWidth]
    : modalWidthMap.narrow;
  const resolvedModalHeight = modalHeight
    ? modalHeightMap[modalHeight]
    : modalHeightMap.large;

  // Smart modal style that adjusts based on content size or uses fixed values if provided
  const modalBodyStyle = {
    minWidth: miniWidth ? miniWidth : "10vw", // Use fixed width if provided, otherwise set a minimum width
    maxWidth: miniWidth
      ? miniWidth
      : resolvedModalWidth === "full"
      ? "100%"
      : resolvedModalWidth, // Use fixed width if provided
    minHeight: miniHeight ? miniHeight : "10vh", // Use fixed height if provided, otherwise set a minimum height
    maxHeight: miniHeight ? miniHeight : resolvedModalHeight, // Use fixed height if provided
    width: miniWidth ? miniWidth : "auto", // Use fixed width if provided
    height: miniHeight ? miniHeight : "auto", // Use fixed height if provided
    overflowY: "auto", // Enable vertical scrolling if content overflows height
    overflowX: "auto", // Enable horizontal scrolling if content overflows width
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size={resolvedModalWidth} // Default to smallest size unless specified
      className="relative"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 text-lg font-semibold">
        <span>{title}</span>
        {/* Hide Close button when the task is running */}
        {!hideButtons && (
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            <HiX className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Modal Body with dynamic or fixed sizing */}
      <Modal.Body className="p-6" style={modalBodyStyle}>
        {children
          ? children
          : modalContent
          ? renderModalContent(modalContent)
          : null}
      </Modal.Body>

      {/* Modal Footer */}

      <Modal.Footer className="flex justify-end space-x-4 border-t px-6 py-4">
        {!hideButtons ? (
          showExecuteButton ? (
            <Button color="primary" onClick={handleButtonClose || onClose}>
              Close
            </Button>
          ) : (
            <>
              {onExecute && (
                <Button color="pink" onClick={onExecute}>
                  {executeButtonName}
                </Button>
              )}
              <Button color="primary" onClick={handleButtonClose || onClose}>
                {executeButtonName === "Run data task" ? "Cancel" : "Close"}
              </Button>
            </>
          )
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

export default DuftModal;
