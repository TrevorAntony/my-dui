import { useState } from "react";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog";
import { client } from "../../../api/DuftHttpClient/local-storage-functions";
import config from "../../../config";

interface ExportDataProps {
  query?: string;
  searchText?: string; 
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: number;
  currentPage?: number;
  dataConnectionId?: string;
}

function ExportData({ 
  query, 
  searchText, 
  searchColumns, 
  sortColumn, 
  pageSize,
  currentPage = 1
}: ExportDataProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = async (format: string, scope: string) => {
    try {
      if (!query) {
        throw new Error('Query is required for export');
      }

      const basePayload = {
        query,
        data_connection_id: config.dataConnection || "ANA",
        current_page: currentPage
      };

      // For filtered data, include search and sort parameters
      if (scope === "filtered") {
        const filterParams: Record<string, any> = {};
        if (searchText) filterParams.search_text = searchText;
        if (searchColumns) filterParams.search_columns = searchColumns;
        if (sortColumn) filterParams.sort_column = sortColumn;
        if (pageSize) {
          const numPageSize = Number(pageSize);
          if (!isNaN(numPageSize) && numPageSize > 0) {
            filterParams.page_size = numPageSize;
          }
        }

        Object.assign(basePayload, filterParams);
      }

      const response = await client.getQueryData({
        ...basePayload,
        format: format.toLowerCase()
      });

      if (!response) {
        throw new Error('No response received from server');
      }

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
      console.error('Export error:', error);
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