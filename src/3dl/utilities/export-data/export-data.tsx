import { useState } from "react";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog";
import { client } from "../../../api/DuftHttpClient/local-storage-functions";
import config from "../../../config";
import { useDataContext } from "../../context/DataContext";

// Props needed for Dataset component compatibility
interface ExportDataProps {
  query?: string;
  searchText?: string;
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: number;
  currentPage?: number;
}

function ExportData({ query: defaultQuery, ...defaultParams }: ExportDataProps = {}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { datasetParams } = useDataContext();

  const handleExport = async (format: string, scope: string) => {
    try {
      // Use context values if available, otherwise fall back to props
      const effectiveParams = {
        query: datasetParams?.query || defaultQuery,
        searchText: datasetParams?.searchText || defaultParams.searchText,
        searchColumns: datasetParams?.searchColumns || defaultParams.searchColumns,
        sortColumn: datasetParams?.sortColumn || defaultParams.sortColumn,
        pageSize: datasetParams?.pageSize || defaultParams.pageSize,
        currentPage: datasetParams?.currentPage || defaultParams.currentPage || 1,
        filters: datasetParams?.filters || {}
      };

      if (!effectiveParams.query) {
        throw new Error("Query is required for export");
      }

      const basePayload = {
        query: effectiveParams.query,
        data_connection_id: config.dataConnection || "ANA",
        current_page: effectiveParams.currentPage,
      };

      if (scope === "filtered") {
        const filterParams: Record<string, any> = {};

        if (effectiveParams.searchText) filterParams["search_text"] = effectiveParams.searchText;
        if (effectiveParams.searchColumns) filterParams["search_columns"] = effectiveParams.searchColumns;
        if (effectiveParams.sortColumn) filterParams["sort_column"] = effectiveParams.sortColumn;
        if (effectiveParams.filters && Object.keys(effectiveParams.filters).length > 0) {
          filterParams["filters"] = effectiveParams.filters;
        }
        
        if (effectiveParams.pageSize) {
          const numPageSize = Number(effectiveParams.pageSize);
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
