import { useState } from "react";
import ExportButton from "./export-button";
import ExportDataDialog from "./export-data-dialog";
import { client } from "../../../../core/api/DuftHttpClient/local-storage-functions";
import config from "../../../../config";
import { useDashboardContext } from "../../dashboard/Dashboard";
import { useDataContext } from "../../../../core/context/DataContext";

function ExportData() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dashboardContext = useDashboardContext();
  const {
    // From DataProvider context
    datasetParams,
    // From Dataset context
    query: datasetQuery,
    queryName: datasetQueryName,
    searchText: directSearchText,
    searchColumns: directSearchColumns,
    sortColumn: directSortColumn,
    pageSize: directPageSize,
    currentPage: directCurrentPage,
  } = useDataContext();

  const interpolateQuery = (query: string, filters: Record<string, any>) => {
    let interpolatedQuery = query;
    // Replace all filter placeholders with empty string when no filters
    if (!filters || Object.keys(filters).length === 0) {
      return interpolatedQuery.replace(/\$\w+/g, "");
    }

    // Replace each placeholder with its value or empty string
    Object.entries(filters).forEach(([key, value]) => {
      const placeholder = `$${key}`;
      interpolatedQuery = interpolatedQuery
        .split(placeholder)
        .join(value || "");
    });
    return interpolatedQuery;
  };

  const handleExport = async (format: string, scope: string) => {
    try {
      // Prefer datasetParams values, fall back to direct context values
      const effectiveParams = {
        query: datasetParams?.query || datasetQuery,
        queryName: datasetParams?.queryName || datasetQueryName,
        searchText: datasetParams?.searchText || directSearchText,
        searchColumns: datasetParams?.searchColumns || directSearchColumns,
        sortColumn: datasetParams?.sortColumn || directSortColumn,
        pageSize: datasetParams?.pageSize || directPageSize,
        currentPage: datasetParams?.currentPage || directCurrentPage || 1,
        filters: datasetParams?.filters || {},
      };
      // Get dashboard filters if they exist
      const dashboardFilters = dashboardContext?.state?.filters || {};

      if (!effectiveParams.query && !effectiveParams.queryName) {
        throw new Error("Either query or queryName is required for export");
      }

      // For "all" scope, never include dashboard filters
      if (scope === "all") {
        const basePayload = effectiveParams.query
          ? {
              query: interpolateQuery(effectiveParams.query, {}),
              data_connection_id: config.dataConnection || "ANA",
              format: format.toLowerCase(),
            }
          : {
              query_name: effectiveParams.queryName,
              data_connection_id: config.dataConnection || "ANA",
              format: format.toLowerCase(),
              filters: {}, // Always use empty filters
            };

        const response = await (effectiveParams.query
          ? client.getQueryData(basePayload)
          : client.getServerQueryData(basePayload));
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
        return;
      }

      // For filtered scope, include all filters, pagination, and dashboard filters
      if (scope === "filtered") {
        const basePayload = effectiveParams.query
          ? {
              query: interpolateQuery(effectiveParams.query, dashboardFilters),
              data_connection_id: config.dataConnection || "ANA",
              current_page: effectiveParams.currentPage,
            }
          : {
              query_name: effectiveParams.queryName,
              data_connection_id: config.dataConnection || "ANA",
              current_page: effectiveParams.currentPage,
              filters: dashboardFilters, // Keep filters for server queries
            };

        const filterParams: Record<string, any> = {};
        if (effectiveParams.searchText)
          filterParams["search_text"] = effectiveParams.searchText;
        if (effectiveParams.searchColumns)
          filterParams["search_columns"] = effectiveParams.searchColumns;
        if (effectiveParams.sortColumn)
          filterParams["sort_column"] = effectiveParams.sortColumn;

        if (effectiveParams.pageSize) {
          const numPageSize = Number(effectiveParams.pageSize);
          if (!isNaN(numPageSize) && numPageSize > 0) {
            filterParams["page_size"] =
              numPageSize * effectiveParams.currentPage;
            filterParams["current_page"] = 1;
          }
        }

        const response = await (effectiveParams.query
          ? client.getQueryData({
              ...basePayload,
              ...filterParams,
              format: format.toLowerCase(),
            })
          : client.getServerQueryData({
              ...basePayload,
              ...filterParams,
              format: format.toLowerCase(),
            }));

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
      }
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
