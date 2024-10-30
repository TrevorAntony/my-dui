import React, { useRef, useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import { Rnd } from "react-rnd";
import { HiX } from "react-icons/hi";
import { renderModalContent } from "../helpers/modalContentHelper";

const modalWidthMap = {
  mini: 400,
  narrow: 600,
  medium: 800,
  wide: 1000,
};

const modalHeightMap = {
  tiny: 0.08,
  smaller: 0.15,
  small: 0.3,
  medium: 0.6,
  large: 0.8,
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
  modalWidth = "medium",
  modalHeight = "medium",
  disableButtons = false,
  closeButtonLabel = "Close",
  defaultButton = "close",
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const executeButtonRef = useRef<HTMLButtonElement | null>(null);

  // State to manage the size and position of the modal
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: modalWidthMap[modalWidth] || 800,
    height: 600,
  });
  const [position, setPosition] = useState({ x: 50, y: 50 });

  // Update height and position based on modalHeight prop
  useEffect(() => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const heightPercentage = modalHeightMap[modalHeight];
    const initialHeight = heightPercentage
      ? windowHeight * heightPercentage
      : 600;

    // Calculate center position - update y to center vertically
    const x = (windowWidth - (modalWidthMap[modalWidth] || 800)) / 2;
    const y = -(windowHeight - initialHeight) * 0.7; // Center vertically

    setSize((prevSize) => ({ ...prevSize, height: initialHeight }));
    setPosition({ x, y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalHeight, modalWidth]);

  const resolvedModalWidth = size.width;
  const resolvedModalHeight = size.height;

  const finalModalBodyStyle = {
    height: resolvedModalHeight ? resolvedModalHeight - 116 : "auto",
    overflowY: "auto",
    overflowX: "auto",
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
      <Rnd
        size={{ width: resolvedModalWidth, height: resolvedModalHeight }}
        position={position}
        onDragStop={(_e, data) => setPosition({ x: data.x, y: data.y })}
        minWidth={300}
        minHeight={200}
        bounds="window"
        enableResizing={{
          bottom: true,
          bottomRight: true,
          right: true,
        }}
        // Update size dynamically during resizing
        onResize={(_e, _direction, ref) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
        }}
        onResizeStop={(_e, _direction, ref) => {
          // Finalize the size on resize stop
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
        }}
        className="rounded-lg bg-white shadow"
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
        <div className="p-6" style={finalModalBodyStyle as React.CSSProperties}>
          {children
            ? children
            : modalContent
            ? renderModalContent(modalContent)
            : null}
        </div>

        <div className="flex justify-end gap-4 border-t px-6 py-4">
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
        </div>
      </Rnd>
    </Modal>
  );
};

export default DuftModal;
