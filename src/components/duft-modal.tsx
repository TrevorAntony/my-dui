import type { ReactNode } from "react";
import React from "react";
import { Modal, Button } from "flowbite-react";

interface DuftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: () => void; // Function to be executed on the second button click
  executeButtonName?: string; // Name for the execution button
  title?: string;
  children: ReactNode;
}

const DuftModal: React.FC<DuftModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonName,
  title,
  children,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <Modal.Header>
        <strong>{title || "More info"}</strong>
      </Modal.Header>
      <Modal.Body className="max-h-[700px]">
        <div className="space-y-6">{children}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
        {executeButtonName && onExecute ? (
          <Button color="pink" onClick={onExecute}>
            {executeButtonName || "Run"}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

export default DuftModal;
