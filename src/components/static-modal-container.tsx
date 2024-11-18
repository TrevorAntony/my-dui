import React from "react";
import { HiX } from "react-icons/hi";
import { Modal, Button } from "flowbite-react";

interface StaticModalContainerProps {
  title: string;
  onClose: () => void;
  disableButtons: boolean;
  finalModalBodyStyle: React.CSSProperties;
  children?: React.ReactNode;
  modalContent: React.ReactNode;
  executeButtonText?: string;
  onExecute?: () => void;
  handleButtonClose?: () => void;
  cancelButtonText: string;
}

const StaticModalContainer: React.FC<StaticModalContainerProps> = ({
  title,
  onClose,
  disableButtons,
  finalModalBodyStyle,
  children,
  modalContent,
  executeButtonText,
  onExecute,
  handleButtonClose,
  cancelButtonText,
}) => (
  <div className="rounded-lg bg-white shadow">
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

    <Modal.Body
      className="p-6"
      style={{
        ...finalModalBodyStyle,
        overflow: "hidden",
      }}
    >
      {children ? children : modalContent}
    </Modal.Body>

    <Modal.Footer className="flex justify-end gap-4 border-t px-6">
      {executeButtonText && onExecute && (
        <Button color="pink" onClick={onExecute} disabled={disableButtons}>
          {executeButtonText || "Run"}
        </Button>
      )}
      <Button
        color="primary"
        onClick={handleButtonClose || onClose}
        disabled={disableButtons}
      >
        {cancelButtonText}
      </Button>
    </Modal.Footer>
  </div>
);

export default StaticModalContainer;
