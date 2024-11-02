import { useState } from "react";
import { useDataContext } from "../../context/DataContext";
import { jsonToCSV, downloadCSV } from "./helpers";
import ExportButton from "./export-button";
import DuftModal from "../../../components/duft-modal";

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
        <DuftModal
          isOpen={isModalOpen}
          onClose={handleModalCancel}
          onExecute={handleModalConfirm}
          title="Confirm Export"
          executeButtonName="Export"
          modalWidth="narrow"
          modalHeight="tiny"
          defaultButton="execute"
          closeButtonLabel="Cancel"
        >
          Are you sure you want to export the data?
        </DuftModal>
      )}
    </>
  );
}

export default ExportData;
