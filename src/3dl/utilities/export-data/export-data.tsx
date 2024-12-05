import { useState } from "react";
import { useDataContext } from "../../context/DataContext";
import { jsonToCSV, downloadCSV } from "./helpers";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog"; 

function ExportData() {
  const { data } = useDataContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = (format: string, scope: string) => {
    const dataToExport = scope === "all" ? data : data;
    
    if (format === "csv") {
      const csv = jsonToCSV(dataToExport as object[]);
      downloadCSV(csv, "export.csv");
    } else if (format === "excel") {
      const csv = jsonToCSV(dataToExport as object[]);
      downloadCSV(csv, "export.xlsx");
    }
  };

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <ExportButton onClick={handleButtonClick} />
      <ExportDataDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onExport={handleExport}
        data={data}
      />
    </>
  );
}

export default ExportData;