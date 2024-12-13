import React, { createContext, useContext, useState, useCallback } from "react";

interface DatasetParams {
  filters: any;
  searchText: string;
  searchColumns: string[];
  sortColumn: string;
  currentPage: number;
  pageSize: number;
  debug: boolean;
  appendData: boolean;
}

const DatasetContext = createContext({
  data: null,
  setData: (data: any) => {},
  datasetParams: {} as DatasetParams,
  setDatasetParams: (params: DatasetParams) => {},
  resetPage: () => {},
  pageUpdater: () => {},
  handleSearchChange: (searchText: string) => {},
  handleSortChange: (sortColumn: string) => {},
});

interface Dataset2Props {
  children: React.ReactNode;
  filters?: any;
  searchText?: string;
  searchColumns?: string[];
  sortColumn?: string;
  currentPage?: number;
  pageSize?: number;
  debug?: boolean;
}

export const Dataset2: React.FC<Dataset2Props> = ({
  children,
  filters = {},
  searchText = "",
  searchColumns = [],
  sortColumn = "",
  currentPage = 1,
  pageSize = 10,
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
  });

  //add filter logic here, listening for filter updates in the dashboard conmponent, and updating the datasetParams accordingly
  //while setting the page to 1 and appendData to false

  const setData = useCallback(
    (newData: any[] | null) => {
      if (datasetParams.appendData && data) {
        setDataInternal((prevData) => [
          ...(prevData || []),
          ...(newData || []),
        ]);
      } else {
        setDataInternal(newData);
      }
    },
    [data, datasetParams.appendData]
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
    <DatasetContext.Provider
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
    </DatasetContext.Provider>
  );
};

export const useDatasetContext = () => useContext(DatasetContext);
