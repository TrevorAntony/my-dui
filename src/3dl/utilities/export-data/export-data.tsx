import { useState } from "react";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog";
import { client } from "../../../api/DuftHttpClient/local-storage-functions";
import config from "../../../config";
import { useDataContext } from "../../context/DataContext";

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
  currentPage = 1,
}: ExportDataProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dataContext = useDataContext();

  const handleExport = async (format: string, scope: string) => {
    try {
      // Use context params if available, otherwise fall back to props
      const effectiveQuery = dataContext?.datasetParams?.query || query;
      if (!effectiveQuery) {
        throw new Error("Query is required for export");
      }

      const basePayload = {
        query: effectiveQuery,
        data_connection_id: config.dataConnection || "ANA",
        current_page: dataContext?.datasetParams?.currentPage || currentPage,
      };

      // For filtered data, include search and sort parameters
      if (scope === "filtered") {
        const filterParams: Record<string, any> = {};
        const contextParams = dataContext?.datasetParams;

        // Prioritize context values over props
        const effectiveSearchText = contextParams?.searchText ?? searchText;
        const effectiveSearchColumns = contextParams?.searchColumns ?? searchColumns;
        const effectiveSortColumn = contextParams?.sortColumn ?? sortColumn;
        const effectivePageSize = contextParams?.pageSize ?? pageSize;
        const effectiveFilters = contextParams?.filters;

        if (effectiveSearchText) filterParams["search_text"] = effectiveSearchText;
        if (effectiveSearchColumns) filterParams["search_columns"] = effectiveSearchColumns;
        if (effectiveSortColumn) filterParams["sort_column"] = effectiveSortColumn;
        if (effectiveFilters && Object.keys(effectiveFilters).length > 0) {
          filterParams["filters"] = effectiveFilters;
        }
        
        if (effectivePageSize) {
          const numPageSize = Number(effectivePageSize);
          if (!isNaN(numPageSize) && numPageSize > 0) {
            filterParams["page_size"] = numPageSize;
          }
        }

        Object.assign(basePayload, filterParams);
      }

      const response = await client.getQueryData({
        ...basePayload,
        format: format.toLowerCase(),
      });

      if (!response) {
        throw new Error("No response received from server");
      }

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");

      Object.assign(link, {
        href: url,
        download: `export.${format.toLowerCase()}`,
        style: { display: "none" },
      });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
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
