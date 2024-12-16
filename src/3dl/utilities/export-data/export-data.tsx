import { useState } from "react";
import { useDataContext } from "../../context/DataContext";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog";
import { client } from "../../../api/DuftHttpClient/local-storage-functions";

function ExportData() {
  const { data, query } = useDataContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = async (format: string, scope: string) => {
    try {
      const response = await client.getQueryData({ query, scope, format: format.toLowerCase() });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      
      Object.assign(link, {
        href: url,
        download: `export.${format.toLowerCase()}`,
        style: { display: 'none' }
      });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <>
      <ExportButton onClick={() => setIsDialogOpen(true)} />
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