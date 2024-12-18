import React, { useState, useCallback } from "react";
import { DataProvider, type DatasetParams } from "../context/DataContext";

interface Dataset2Props {
  children: React.ReactNode;
  filters?: any;
  searchText?: string;
  searchColumns?: string;
  sortColumn?: string;
  currentPage?: number;
  pageSize?: number;
  debug?: boolean;
}

const Dataset2: React.FC<Dataset2Props> = ({
  children,
  filters = {},
  searchText = "",
  searchColumns = "",
  sortColumn = "",
  currentPage = 1,
  pageSize,
  debug = false,
}) => {
  const [data, setDataInternal] = useState<null | any[]>(null);
  const [datasetParams, setDatasetParams] = useState<DatasetParams>({
    filters,
    searchText,
    searchColumns,
    sortColumn,
    currentPage,
    pageSize,
    debug,
    appendData: false,
    loading: false,
    error: null,
    query: "",
  });

  //add filter logic here, listening for filter updates in the dashboard conmponent, and updating the datasetParams accordingly
  //while setting the cuurentPage to 1 and appendData to false

  const setData = useCallback(
    (newData: any[] | null) => {
      if (datasetParams.appendData && newData) {
        setDataInternal((prevData) => [
          ...(prevData || []),
          ...(newData || []),
        ]);
      } else {
        setDataInternal(newData);
      }
    },
    [datasetParams.appendData]
  );

  const resetPage = useCallback(() => {
    setDatasetParams((prev) => ({
      ...prev,
      currentPage: 1,
      appendData: false,
    }));
  }, []);

  const pageUpdater = useCallback(() => {
    setDatasetParams((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      appendData: true,
    }));
  }, []);

  const handleSearchChange = useCallback((newSearchText: string) => {
    setDatasetParams((prev) => ({
      ...prev,
      searchText: newSearchText,
      currentPage: 1, // Reset page when search changes
      appendData: false,
    }));
  }, []);

  const handleSortChange = useCallback((newSortColumn: string) => {
    setDatasetParams((prev) => ({
      ...prev,
      sortColumn: newSortColumn,
      currentPage: 1, // Reset page when sort changes
      appendData: false,
    }));
  }, []);

  return (
    <DataProvider
      value={{
        data,
        setData,
        datasetParams,
        setDatasetParams,
        resetPage,
        pageUpdater,
        handleSearchChange,
        handleSortChange,
      }}
    >
      {children}
    </DataProvider>
  );
};
export default Dataset2;
