import React from "react";
import type { DuftModalProps } from "./duft-modal";
import DuftModal from "./duft-modal";

// Define the new component props, extending from DuftModalProps
interface DataTaskModalProps extends DuftModalProps {
  maxHeightOverride?: string;
  sizeOverride?: string;
}

// Define a new React component called DataTaskModal
const DataTaskModal: React.FC<DataTaskModalProps> = ({
  sizeOverride,
  maxHeightOverride,
  ...props
}) => {
  // Override the default modal width and height with smaller dimensions
  const defaultWidth = "mini";
  const defaultHeight = "micro";

  return (
    <DuftModal
      {...props} // Spread the remaining props (e.g., isOpen, onClose)
      modalWidth={props.modalWidth || defaultWidth}
      modalHeight={props.modalHeight || defaultHeight}
      miniHeight={maxHeightOverride ? undefined : props.miniHeight}
      modalBodyStyle={{
        ...(props.modalBodyStyle || {}),
        maxHeight: maxHeightOverride ? maxHeightOverride : undefined,
      }}
      size={sizeOverride || undefined}
    />
  );
};

export default DataTaskModal;
