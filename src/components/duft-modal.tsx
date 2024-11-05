import React, { useRef, useMemo } from "react";
import { Modal } from "flowbite-react";
import { renderModalContent } from "../helpers/modalContentHelper";
import { calculateInitialModalSizeConfig } from "../helpers/modal-size-config";
import { useModalSize } from "../hooks/useModalSize";
import { useModalPosition } from "../hooks/useModalPosition";
import DraggableResizableModalContainer from "./draggable-resizable-modal-container";
import type { modalWidthMap, modalHeightMap } from "../helpers/constants";

type ModalContent =
  | string
  | string[]
  | { [key: string]: string | number | boolean };

export interface DuftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute?: () => void;
  executeButtonText?: string;
  title?: string;
  children?: React.ReactNode;
  modalContent?: ModalContent;
  handleButtonClose?: () => void;
  modalWidth?: keyof typeof modalWidthMap;
  modalHeight?: keyof typeof modalHeightMap;
  disableButtons?: boolean;
  cancelButtonText?: string;
  defaultButton?: "execute" | "close";
}

const DuftModal: React.FC<DuftModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  executeButtonText = "Run",
  title = "More info",
  children,
  modalContent,
  handleButtonClose,
  modalWidth = "medium",
  modalHeight = "medium",
  disableButtons = false,
  cancelButtonText = "Close",
  defaultButton = "close",
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const executeButtonRef = useRef<HTMLButtonElement | null>(null);

  const initialConfig = useMemo(
    () => calculateInitialModalSizeConfig(modalWidth, modalHeight),
    [modalWidth, modalHeight],
  );

  const { size, handleResize } = useModalSize(
    initialConfig.width,
    initialConfig.height,
  );
  const { position, handleDragStop } = useModalPosition(
    initialConfig.x,
    initialConfig.y,
  );

  const resolvedModalWidth = size.width;
  const resolvedModalHeight = size.height;

  const finalModalBodyStyle: React.CSSProperties = {
    height: resolvedModalHeight ? resolvedModalHeight - 116 : "auto",
    overflowY: "auto" as React.CSSProperties["overflowY"],
    overflowX: "auto" as React.CSSProperties["overflowX"],
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size={resolvedModalWidth}
      className="fixed inset-0 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <DraggableResizableModalContainer
        title={title}
        onClose={onClose}
        disableButtons={disableButtons}
        resolvedModalWidth={resolvedModalWidth}
        resolvedModalHeight={resolvedModalHeight}
        position={position}
        handleDragStop={handleDragStop}
        minHeight={initialConfig.minHeight}
        handleResize={handleResize}
        finalModalBodyStyle={finalModalBodyStyle}
        modalContent={modalContent ? renderModalContent(modalContent) : null}
        executeButtonText={executeButtonText}
        onExecute={onExecute}
        executeButtonRef={executeButtonRef}
        closeButtonRef={closeButtonRef}
        handleButtonClose={handleButtonClose}
        cancelButtonText={cancelButtonText}
        defaultButton={defaultButton}
      >
        {children}
      </DraggableResizableModalContainer>
    </Modal>
  );
};

export default DuftModal;
