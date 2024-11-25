import React from "react";
import { Rnd } from "react-rnd";
import { HiX } from "react-icons/hi";
import { Modal, Button } from "flowbite-react";

interface DraggableResizableModalContainerProps {
  title: string;
  onClose: () => void;
  disableButtons: boolean;
  resolvedModalWidth: number;
  resolvedModalHeight: number;
  position: { x: number; y: number };
  handleDragStop: (x: number, y: number) => void;
  minHeight: number;
  handleResize: (width: number, height: number) => void;
  finalModalBodyStyle: React.CSSProperties;
  children?: React.ReactNode;
  modalContent: React.ReactNode;
  executeButtonText?: string;
  onExecute?: () => void;
  executeButtonRef: React.RefObject<HTMLButtonElement>;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
  handleButtonClose?: () => void;
  cancelButtonText: string;
  defaultButton: "execute" | "close";
}

const DraggableResizableModalContainer: React.FC<
  DraggableResizableModalContainerProps
> = ({
  title,
  onClose,
  disableButtons,
  resolvedModalWidth,
  resolvedModalHeight,
  position,
  handleDragStop,
  minHeight,
  handleResize,
  finalModalBodyStyle,
  children,
  modalContent,
  executeButtonText,
  onExecute,
  executeButtonRef,
  closeButtonRef,
  handleButtonClose,
  cancelButtonText,
  defaultButton,
}) => (
  <Rnd
    size={{ width: resolvedModalWidth, height: resolvedModalHeight }}
    position={position}
    onDragStop={(_e, data) => handleDragStop(data.x, data.y)}
    minWidth={300}
    minHeight={minHeight}
    bounds="window"
    enableResizing={{
      bottom: true,
      bottomRight: true,
      right: true,
    }}
    onResize={(_e, _direction, ref) => {
      handleResize(ref.offsetWidth, ref.offsetHeight);
    }}
    onResizeStop={(_e, _direction, ref) => {
      handleResize(ref.offsetWidth, ref.offsetHeight);
    }}
    className="rounded-lg bg-white shadow"
  >
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

    <Modal.Body
      className="py-6"
      style={{
        ...finalModalBodyStyle,
        overflow: "hidden",
      }}
    >
      {children ? children : modalContent}
    </Modal.Body>

    <Modal.Footer className="flex justify-end gap-4 border-t px-6">
      {executeButtonText && onExecute && (
        <Button
          color={defaultButton === "execute" ? "primary" : "pink"}
          onClick={onExecute}
          disabled={disableButtons}
          ref={executeButtonRef}
        >
          {executeButtonText || "Run"}
        </Button>
      )}

      <Button
        color={defaultButton === "close" ? "primary" : "pink"}
        onClick={handleButtonClose || onClose}
        disabled={disableButtons}
        ref={closeButtonRef}
      >
        {cancelButtonText}
      </Button>
    </Modal.Footer>
  </Rnd>
);

export default DraggableResizableModalContainer;
