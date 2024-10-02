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
  hideFooter?: boolean;
  showExecuteButton?: boolean;
  handleButtonClose?: () => void;
  modalWidth?: keyof typeof modalWidthMap;
  modalHeight?: keyof typeof modalHeightMap;
}

const DuftModal: React.FC<DuftModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonName = "Run",
  title = "More info",
  children,
  modalContent,
  hideFooter = false,
  showExecuteButton = false,
  handleButtonClose,
  modalWidth, // Allow undefined for default handling
  modalHeight, // Allow undefined for default handling
}) => {
  // Determine default width (narrow) and height (large) if not specified
  const resolvedModalWidth = modalWidth
    ? modalWidthMap[modalWidth]
    : modalWidthMap.narrow;
  const resolvedModalHeight = modalHeight
    ? modalHeightMap[modalHeight]
    : modalHeightMap.large;

  // Smart modal style that adjusts based on content size with min and max constraints
  const modalBodyStyle = {
    minWidth: "20vw", // Minimum width to wrap small content
    maxWidth: resolvedModalWidth === "full" ? "100%" : resolvedModalWidth, // Maximum width based on prop or default
    minHeight: "20vh", // Minimum height to wrap small content
    maxHeight: resolvedModalHeight, // Maximum height based on prop or default
    width: "auto", // Allow auto width for wrapping small content
    height: "auto", // Allow auto height for wrapping small content
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
      <div className="relative flex justify-between px-6 pt-6 text-lg font-semibold">
        <span>{title || "More info"}</span>

        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <HiX className="h-6 w-6" />
        </button>
      </div>

      {/* Modal Body with dynamic sizing */}
      <Modal.Body className="p-6" style={modalBodyStyle}>
        {children
          ? children
          : modalContent
          ? renderModalContent(modalContent)
          : null}
      </Modal.Body>

      {/* Modal Footer */}
      {!hideFooter && (
        <Modal.Footer className="flex justify-end space-x-4 border-t px-6 py-4">
          {showExecuteButton ? (
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
                Close
              </Button>
            </>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default DuftModal;
