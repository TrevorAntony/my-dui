import { useState } from "react";
import { useDataContext } from "../../context/DataContext";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog";
import { client } from "../../../api/DuftHttpClient/local-storage-functions";

function ExportData() {
  const { query, searchText, searchColumns, sortColumn } = useDataContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = async (format: string, scope: string) => {
    try {
      const requestPayload = {
        query,
        format: format.toLowerCase(),
        // Only include filters/search/sort if we want filtered data
        ...(scope === "filtered" && {
          search_text: searchText,
          search_columns: searchColumns,
          sort_column: sortColumn
        })
      };

      const response = await client.getQueryData(requestPayload);
      
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
      />
    </>
  );
}

export default ExportData;