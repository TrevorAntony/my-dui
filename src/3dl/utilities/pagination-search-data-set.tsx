import React, { useEffect, useRef, useState } from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";
import { useInfiniteScroll, useSearchText, buildQuery } from "./helpers";

interface DataSetProps {
  query?: string;
  staticData?: any;
  useQuery: any;
  children?: React.ReactNode;
  dataConnection?: string;
  pageSize?: number;
}

const PaginatedSearchDataSet: React.FC<DataSetProps> = ({
  query = "",
  staticData,
  useQuery,
  children,
  dataConnection,
  pageSize = 15,
}) => {
  const [paginatedData, setPaginatedData] = useState<any[]>([]);
  const previousSearchText = useRef<string>("");

  const { offset, nextPage, resetPage } = useInfiniteScroll(pageSize);
  const { searchText, handleSearchChange } = useSearchText(resetPage);

  const { modifiedQuery, searchModification } = buildQuery(
    query,
    pageSize,
    offset,
    searchText
  );

  const { data, error, state } = useDataSetLogic(
    modifiedQuery,
    staticData,
    useQuery,
    dataConnection
  );

  if (searchText && modifiedQuery.includes(searchText))
    console.log({ [searchText]: data });

  // // Effect 1: Handles when search text is provided and is different from the previous search text
  // useEffect(() => {
  //   if (
  //     searchText &&
  //     previousSearchText.current !== searchText &&
  //     Array.isArray(data)
  //   ) {
  //     console.log(
  //       "search text is provided and is different from the previous search text"
  //     );
  //     setPaginatedData(data); // Reset paginated data to new data
  //     previousSearchText.current = searchText;
  //   }
  // }, [searchText, data]);

  // // Effect 2: Handles when search text is provided and is the same as the previous search text
  // useEffect(() => {
  //   if (
  //     searchText &&
  //     previousSearchText.current === searchText &&
  //     Array.isArray(data)
  //   ) {
  //     console.log(
  //       "search text is provided and is the same as the previous search text"
  //     );
  //     setPaginatedData((prevData) => [...prevData, ...data]); // Append new data to the existing paginated data
  //   }
  // }, [searchText, data]);

  // // Effect 3: Handles when there is no search text but there is data
  // useEffect(() => {
  //   if (!searchText && Array.isArray(data)) {
  //     console.log("no search text but there is data");
  //     setPaginatedData((prevData) => [...prevData, ...data]); // Append new data to the existing paginated data
  //   }
  // }, [searchText, data]);

  useEffect(() => {
    if (!Array.isArray(data)) return; // Early exit if data is not an array

    if (searchModification) {
      // If search text is provided and differs from the previous search text, reset paginated data
      if (previousSearchText.current !== searchText) {
        // console.log(
        //   "search text is provided and differs from the previous search text"
        // );
        // console.log({ prevText: previousSearchText.current, searchText });
        // console.log({ data });
        // console.log({
        //   searchTextIsInQuery: modifiedQuery.includes(searchText),
        // });
        setPaginatedData(data); // Reset paginated data to new data
        previousSearchText.current = searchText; // Update previous search text
      } else if (previousSearchText.current == searchText) {
        setPaginatedData((prevData) => [...prevData, ...data]);
      } else {
        // If search text is the same as the previous one, append new data
        // console.log(
        //   "search text is the same as the previous one, append new data"
        // );
        // console.log({ prevText: previousSearchText.current, searchText });
        // console.log({ data });
        setPaginatedData(data);
      }
    } else {
      // If there is no search text, append new data
      // console.log("there is no search text, append new data");
      // console.log({ data });

      setPaginatedData((prevData) => [...prevData, ...data]);
      // setPaginatedData(data);
    }
  }, [searchModification, data]);

  // console.log({ data_going_to_table: paginatedData });

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <DataProvider
      value={{ data: paginatedData, pageUpdater: nextPage, handleSearchChange }}
    >
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

export default PaginatedSearchDataSet;
