import React, { useRef, useState } from "react";
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

const calculateInitialModalConfig = (
  modalWidth: keyof typeof modalWidthMap,
  modalHeight: keyof typeof modalHeightMap,
) => {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const width = modalWidthMap[modalWidth] || 800;
  const heightPercentage = modalHeightMap[modalHeight];
  const height = heightPercentage ? windowHeight * heightPercentage : 600;

  const x = (windowWidth - width) / 2;
  const y =
    heightPercentage <= 0.3
      ? -(windowHeight - height) * 0.2
      : -(windowHeight - height) * 0.7;

  return { width, height, x, y };
};

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

  const initialConfig = calculateInitialModalConfig(modalWidth, modalHeight);

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: initialConfig.width,
    height: initialConfig.height,
  });
  const [position, setPosition] = useState({
    x: initialConfig.x,
    y: initialConfig.y,
  });

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
        onResize={(_e, _direction, ref) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
        }}
        onResizeStop={(_e, _direction, ref) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
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
          className="p-6"
          style={finalModalBodyStyle as React.CSSProperties}
        >
          {children
            ? children
            : modalContent
            ? renderModalContent(modalContent)
            : null}
        </Modal.Body>

        <Modal.Footer className="flex justify-end gap-4 border-t px-6">
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
      </Rnd>
    </Modal>
  );
};

export default DuftModal;
