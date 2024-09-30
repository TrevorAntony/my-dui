import { useDataContext } from "../../context/DataContext";
import { jsonToCSV, downloadCSV } from "./helpers";
import ExportButton from "./export-button";

function ExportData() {
  const { data } = useDataContext();

  const handleExport = () => {
    const csv = jsonToCSV(data);
    downloadCSV(csv, "export.csv");
  };

  return <ExportButton onClick={handleExport} />;
}

export default ExportData;
