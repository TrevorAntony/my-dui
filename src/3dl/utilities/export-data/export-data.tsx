import { useState } from "react";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog";
import { client } from "../../../api/DuftHttpClient/local-storage-functions";
import config from "../../../config";
import { useDataContext } from "../../context/DataContext";

function ExportData() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    // From DataProvider context
    datasetParams,
    // From Dataset context
    query: datasetQuery,
    searchText: directSearchText,
    searchColumns: directSearchColumns,
    sortColumn: directSortColumn,
    pageSize: directPageSize,
    currentPage: directCurrentPage,
  } = useDataContext();

  const handleExport = async (format: string, scope: string) => {
    try {
      // Prefer datasetParams values, fall back to direct context values
      const effectiveParams = {
        query: datasetParams?.query || datasetQuery,
        searchText: datasetParams?.searchText || directSearchText,
        searchColumns: datasetParams?.searchColumns || directSearchColumns,
        sortColumn: datasetParams?.sortColumn || directSortColumn,
        pageSize: datasetParams?.pageSize || directPageSize,
        currentPage: datasetParams?.currentPage || directCurrentPage || 1,
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
            filterParams["page_size"] = numPageSize * effectiveParams.currentPage;
            filterParams["current_page"] = 1;
          }
        }

        Object.assign(basePayload, filterParams);
      }

      if (scope === "all") {
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
            filterParams["page_size"] = numPageSize * effectiveParams.currentPage;
            filterParams["current_page"] = 1;
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
