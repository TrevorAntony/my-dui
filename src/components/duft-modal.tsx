import React, { useRef } from "react";
import { Modal, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { renderModalContent } from "../helpers/modalContentHelper";

const modalWidthMap = {
  mini: "sm",
  narrow: "3xl",
  medium: "7xl",
  wide: "full",
};

const modalHeightMap = {
  tiny: "8vh",
  smaller: "15vh",
  small: "30vh",
  medium: "60vh",
  large: "80vh",
};

type ModalContent =
  | string
  | string[]
  | { [key: string]: string | number | boolean };

export interface DuftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute?: () => void;
  executeButtonName?: string;
  title?: string;
  children?: React.ReactNode;
  modalContent?: ModalContent;
  handleButtonClose?: () => void;
  modalWidth?: keyof typeof modalWidthMap;
  modalHeight?: keyof typeof modalHeightMap;
  disableButtons?: boolean;
  closeButtonLabel?: string;
  defaultButton?: "execute" | "close";
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
  disableButtons = false,
  closeButtonLabel = "Close",
  defaultButton = "close",
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const executeButtonRef = useRef<HTMLButtonElement | null>(null);

  const resolvedModalWidth = modalWidth ? modalWidthMap[modalWidth] : "7xl";
  const resolvedModalHeight = modalHeight
    ? modalHeightMap[modalHeight]
    : "auto";

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
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 text-lg font-semibold">
        <span id="modal-title">{title}</span>
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

      {/* Modal Body */}
      <Modal.Body
        className="p-6"
        style={finalModalBodyStyle as React.CSSProperties}
      >
        {children
          ? children
          : modalContent
          ? renderModalContent(modalContent)
          : null}
      </Modal.Body>

      <Modal.Footer className="flex justify-end">
        {executeButtonName && onExecute && (
          <Button
            color={defaultButton === "execute" ? "primary" : "pink"}
            onClick={onExecute}
            disabled={disableButtons}
            ref={executeButtonRef}
          >
            {executeButtonName || "Run"}
          </Button>
        )}

        <Button
          color={defaultButton === "close" ? "primary" : "pink"}
          onClick={handleButtonClose || onClose}
          disabled={disableButtons}
          ref={closeButtonRef}
        >
          {closeButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DuftModal;
