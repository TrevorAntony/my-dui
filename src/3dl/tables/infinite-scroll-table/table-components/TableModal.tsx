import React from "react";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  ModalComponent: React.ElementType;
  renderedChild: React.ReactNode;
  selectedRowData: any;
}

const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  ModalComponent,
  renderedChild,
  selectedRowData,
}) => {
  if (!isOpen || !ModalComponent) return null;

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      {renderedChild ? renderedChild : selectedRowData}
    </ModalComponent>
  );
};

export default TableModal;
