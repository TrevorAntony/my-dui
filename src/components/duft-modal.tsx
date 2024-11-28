import React from "react";
import { Modal } from "flowbite-react";
import { renderModalContent } from "../helpers/modalContentHelper";
import StaticModalContainer from "./static-modal-container";
import DraggableResizableModalContainer from "./draggable-resizable-modal-container";
import { useModalConfig } from "../hooks/useModalConfig";
import type {
  modalPixelWidthMap,
  modalViewportHeightRatioMap,
} from "../helpers/constants";
import type {
  modalSymbolicWidthMap,
  modalViewportHeightMap,
} from "../helpers/constants";

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
  modalWidth?:
    | keyof typeof modalPixelWidthMap
    | keyof typeof modalSymbolicWidthMap;
  modalHeight?:
    | keyof typeof modalViewportHeightRatioMap
    | keyof typeof modalViewportHeightMap;
  disableButtons?: boolean;
  cancelButtonText?: string;
  defaultButton?: "execute" | "close";
  resize?: string;
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
  resize = "false",
}) => {
  const { containerProps, finalModalBodyStyle } = useModalConfig({
    resize,
    modalWidth,
    modalHeight,
  });

  const shouldResize = resize === "true";

  return (
    <Modal show={isOpen} onClose={onClose} size={"lg"} className="relative">
      {shouldResize ? (
        <DraggableResizableModalContainer
          title={title}
          onClose={onClose}
          disableButtons={disableButtons}
          resolvedModalWidth={containerProps.resolvedModalWidth}
          resolvedModalHeight={containerProps.resolvedModalHeight}
          position={containerProps.position}
          handleDragStop={containerProps.handleDragStop}
          minHeight={containerProps.initialConfig?.minHeight}
          handleResize={containerProps.handleResize}
          finalModalBodyStyle={finalModalBodyStyle}
          modalContent={modalContent ? renderModalContent(modalContent) : null}
          executeButtonText={executeButtonText}
          onExecute={onExecute}
          executeButtonRef={containerProps.executeButtonRef}
          closeButtonRef={containerProps.closeButtonRef}
          handleButtonClose={handleButtonClose}
          cancelButtonText={cancelButtonText}
          defaultButton={defaultButton}
        >
          {children}
        </DraggableResizableModalContainer>
      ) : (
        <StaticModalContainer
          title={title}
          onClose={onClose}
          disableButtons={disableButtons}
          finalModalBodyStyle={finalModalBodyStyle}
          modalContent={modalContent ? renderModalContent(modalContent) : null}
          executeButtonText={executeButtonText}
          onExecute={onExecute}
          handleButtonClose={handleButtonClose}
          cancelButtonText={cancelButtonText}
        >
          {children}
        </StaticModalContainer>
      )}
    </Modal>
  );
};

export default DuftModal;
