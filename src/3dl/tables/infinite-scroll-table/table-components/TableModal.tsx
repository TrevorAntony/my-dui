/* eslint-disable @typescript-eslint/no-explicit-any */
//TO:DO replace the explicit anys with row types once added
import React from "react";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  ModalComponent: React.ElementType;
  renderedChild: React.ReactNode;
  selectedRowData: any;
  resize?: string;
}

const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  ModalComponent,
  renderedChild,
  selectedRowData,
  resize,
}) => {
  if (!isOpen || !ModalComponent) return null;

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} resize={resize}>
      {renderedChild ? renderedChild : selectedRowData}
    </ModalComponent>
  );
};

export default TableModal;
