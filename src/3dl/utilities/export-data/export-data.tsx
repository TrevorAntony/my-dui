import { useState } from "react";
import { useDataContext } from "../../context/DataContext";
import { jsonToCSV, downloadCSV } from "./helpers";
import ExportButton from "./export-button";
import { Button, Modal } from "flowbite-react";

function ExportData() {
  const { data } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExport = () => {
    const csv = jsonToCSV(data as object[]);
    downloadCSV(csv, "export.csv");
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    handleExport();
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ExportButton onClick={handleButtonClick} />
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onClose={() => handleModalCancel()}
          position="center"
          size="3xl"
        >
          <Modal.Header>Confirm Export</Modal.Header>
          <Modal.Body className="flex flex-col overflow-hidden ">
            <div className="text-default">
              Are you sure you want to export the data?
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button onClick={() => handleModalConfirm()} color="primary">
                Export
              </Button>
              <Button onClick={() => handleModalCancel()} color="secondary">
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default ExportData;
