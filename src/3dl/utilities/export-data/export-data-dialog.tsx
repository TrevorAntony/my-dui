import React, { useState } from "react";
import { Modal, Button, Select } from "flowbite-react";

export interface ExportDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, scope: string) => void;
  data?: any; // Data to be exported
}

const ExportDataDialog: React.FC<ExportDataDialogProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [format, setFormat] = useState("excel");
  const [scope, setScope] = useState("filtered");

  const handleExport = () => {
    onExport(format, scope);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} position="center" size="xl">
      <Modal.Header>
        Export Data
      </Modal.Header>
      <Modal.Body className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This will download the data. You can choose to only download the filtered data, or all data.
        </p>
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Data to export:
            </label>
            <Select 
              className="flex-1"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="filtered">Filtered</option>
              <option value="all">All</option>
            </Select>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Data format:
            </label>
            <Select 
              className="flex-1"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button color="secondary" onClick={handleExport}>
          Export
        </Button>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportDataDialog;