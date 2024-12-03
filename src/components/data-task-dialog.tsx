import React from "react";
import { Modal } from "flowbite-react";
import { Button } from "flowbite-react";

export interface DataTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute?: () => void;
  executeButtonText?: string;
  title?: string;
  children?: React.ReactNode;
  handleButtonClose?: () => void;
  disableButtons?: boolean;
  cancelButtonText?: string;
  defaultButton?: "execute" | "close";
}

const DataTaskDialog: React.FC<DataTaskDialogProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonText = "Run",
  title = "Info",
  children,
  handleButtonClose,
  disableButtons = false,
  cancelButtonText = "Close",
}) => {
  return (
    <Modal show={isOpen} onClose={() => onClose()} position="center" size="2xl">
      <Modal.Header className="text-default">{title}</Modal.Header>
      <Modal.Body className="flex flex-col overflow-auto text-default">
        {children}
      </Modal.Body>
      <Modal.Footer className="flex justify-end w-full gap-4">
        {executeButtonText && onExecute && (
          <Button color="secondary" onClick={onExecute} disabled={disableButtons}>
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
    </Modal>
  );
};

export default DataTaskDialog;
