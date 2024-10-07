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
  miniWidth?: string;
  miniHeight?: string;
  modalBodyStyle?: React.CSSProperties;
  size?: string;
  disableButtons?: boolean; // New prop to disable/enable buttons
  closeButtonLabel?: string; // New prop for Close button label
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
  miniWidth,
  miniHeight,
  modalBodyStyle,
  size,
  disableButtons = false, // Default to false (buttons are enabled)
  closeButtonLabel = "Close",
}) => {
  // Determine default width (medium) and height (small) if not specified
  const resolvedModalWidth = modalWidth
    ? modalWidthMap[modalWidth]
    : modalWidthMap.medium;
  const resolvedModalHeight = modalHeight
    ? modalHeightMap[modalHeight]
    : modalHeightMap.small;

  // Smart modal style that adjusts based on content size or uses fixed values if provided
  const finalModalBodyStyle = {
    minWidth: miniWidth ? miniWidth : "10vw",
    maxWidth: miniWidth
      ? miniWidth
      : resolvedModalWidth === "full"
      ? "100%"
      : resolvedModalWidth,
    minHeight: miniHeight ? miniHeight : "10vh",
    maxHeight: miniHeight ? miniHeight : resolvedModalHeight,
    width: resolvedModalWidth ? resolvedModalWidth : "auto",
    height: resolvedModalHeight ? resolvedModalHeight : "auto",
    overflowY: "auto",
    overflowX: "auto",
    ...modalBodyStyle,
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size={size ? size : resolvedModalWidth} // Default to smallest size unless specified
      className="relative"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 text-lg font-semibold">
        <span>{title}</span>
        {/* Hide Close button when the task is running */}
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
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
