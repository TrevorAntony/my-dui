import React from "react";
import { Modal, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { renderModalContent } from "../helpers/modalContentHelper";

const modalSizeMap = {
  small: "3xl",
  medium: "7xl",
  large: "full",
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
  handleButtonClose?: () => void;
  modalSize?: "small" | "medium" | "large";
}

const DuftModal: React.FC<DuftModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonName,
  title,
  children,
  modalContent,
  hideFooter = false,
  handleButtonClose,
  modalSize = "small",
}) => {
  const resolvedModalSize =
    modalSizeMap[modalSize as keyof typeof modalSizeMap];

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size={resolvedModalSize}
      className="relative"
      style={{
        width: "100%",
        height: "auto",
        overflowY: "auto",
        overflowX: "auto",
      }}
    >
      <div className="relative flex justify-between px-6 pt-6 text-lg font-semibold">
        <span>{title || "More info"}</span>

        <button
          type="button"
          className="absolute right-0 top-0 m-3 p-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <HiX className="h-6 w-6" />
        </button>
      </div>

      <Modal.Body
        className="space-y-6"
        style={{
          maxHeight: "calc(100vh - 150px)",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        {children ? (
          <div>{children}</div>
        ) : modalContent ? (
          renderModalContent(modalContent)
        ) : null}
      </Modal.Body>

      {!hideFooter && (
        <Modal.Footer className="flex justify-end">
          <Button color="primary" onClick={handleButtonClose || onClose}>
            Close
          </Button>
          {executeButtonName && onExecute && (
            <Button color="pink" onClick={onExecute}>
              {executeButtonName || "Run"}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default DuftModal;
