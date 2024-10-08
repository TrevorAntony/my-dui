import React from "react";
import { Modal, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { renderModalContent } from "../helpers/modalContentHelper";

// Updated Modal Width Map with a smaller size
const modalWidthMap = {
  mini: "sm",
  narrow: "3xl",
  medium: "7xl",
  wide: "full",
};

const modalHeightMap = {
  tiny: "8vh", // Very small size
  smaller: "15vh", // Smaller size
  small: "30vh", // Small size
  medium: "60vh", // Medium size
  large: "80vh", // Large size
};

export interface DuftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute?: () => void;
  executeButtonName?: string;
  title?: string;
  children?: React.ReactNode;
  modalContent?: string | string[] | Record<string, any>;
  handleButtonClose?: () => void;
  modalWidth?: keyof typeof modalWidthMap;
  modalHeight?: keyof typeof modalHeightMap;
  disableButtons?: boolean;
  closeButtonLabel?: string;
}

const DuftModal: React.FC<DuftModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonName = "Run",
  title = "More info",
  children,
  modalContent,
  handleButtonClose,
  modalWidth,
  modalHeight,
  // miniWidth,
  // miniHeight,
  disableButtons = false,
  closeButtonLabel = "Close",
}) => {
  // Determine resolved modal width and height based on the provided props or defaults
  const resolvedModalWidth = modalWidth ? modalWidthMap[modalWidth] : "7xl";
  const resolvedModalHeight = modalHeight
    ? modalHeightMap[modalHeight]
    : "auto";

  // Smart modal style: Set fixed dimension only when the corresponding prop is provided
  const finalModalBodyStyle = {
    height: modalHeight ? resolvedModalHeight : "auto",
    maxWidth: !modalWidth ? resolvedModalWidth : undefined,
    overflowY: "auto",
    overflowX: "auto",
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size={resolvedModalWidth}
      className="relative"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 text-lg font-semibold">
        <span>{title}</span>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
          disabled={disableButtons}
        >
          <HiX className="h-6 w-6" />
        </button>
      </div>

      {/* Modal Body with dynamic or fixed sizing */}
      <Modal.Body className="p-6" style={finalModalBodyStyle}>
        {children
          ? children
          : modalContent
          ? renderModalContent(modalContent)
          : null}
      </Modal.Body>

      <Modal.Footer className="flex justify-end">
        {executeButtonName && onExecute && (
          <Button color="pink" onClick={onExecute} disabled={disableButtons}>
            {executeButtonName || "Run"}
          </Button>
        )}

        <Button
          color="primary"
          onClick={handleButtonClose || onClose}
          disabled={disableButtons}
        >
          {closeButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DuftModal;
