import React, { useEffect, useRef } from "react";
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
  hideCloseButton?: boolean;
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
  hideCloseButton = false,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [children]);
  return (
    <Modal 
      show={isOpen} 
      onClose={() => {
        if (!disableButtons && !hideCloseButton) {
          onClose();
        }
      }} 
      position="center" 
      size="2xl"
      dismissible={!disableButtons && !hideCloseButton}
    >
      <Modal.Header className="text-default">{title}</Modal.Header>
      <Modal.Body
        ref={contentRef}
        className="flex flex-col overflow-auto text-default"
      >
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
          disabled={disableButtons || hideCloseButton}
          className={`${(disableButtons || hideCloseButton) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {cancelButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DataTaskDialog;
