import type { SetStateAction } from "react";
import { useState } from "react";

export const buildPaginatedQuery = (
  query: string,
  pageSize: any,
  offset: any
) => {
  return query.replace("{pageSize}", pageSize).replace("{offset}", offset);
};

export const buildSearchQuery = (query: string, searchText: string) => {
  const sanitizedSearchText = searchText?.replace(/[^a-zA-Z0-9\s]/g, "");

  return query.replace(
    "{searchTextCondition}",
    sanitizedSearchText ? `AND year LIKE '%${sanitizedSearchText}%'` : ""
  );
};

export const buildQuery = (
  query: string,
  pageSize: number,
  offset: number | undefined,
  searchText: string
) => {
  let modifiedQuery = query;
  let paginationModification = false;
  let searchModification = false;
  if (
    pageSize > 0 &&
    query.includes("{pageSize}") &&
    query.includes("{offset}")
  ) {
    modifiedQuery = buildPaginatedQuery(modifiedQuery, pageSize, offset);
    paginationModification = true;
  }

  if (query.includes("{searchTextCondition}")) {
    if (searchText) {
      searchModification = true;
    }
    modifiedQuery = buildSearchQuery(modifiedQuery, searchText);
  }

  return { modifiedQuery, paginationModification, searchModification };
};

export const useInfiniteScroll = (pageSize: number) => {
  const [infiniteScrollConfig, setInfiniteScrollConfig] = useState({
    pageIndex: 1,
  });

  // Calculate the offset based on the pageIndex and pageSize
  const offset = (infiniteScrollConfig.pageIndex - 1) * pageSize;

  // Function to update the page index
  const nextPage = () => {
    setInfiniteScrollConfig((prevConfig) => ({
      ...prevConfig,
      pageIndex: prevConfig.pageIndex + 1,
    }));
  };

  return { pageIndex: infiniteScrollConfig.pageIndex, offset, nextPage };
};

export const useSearchText = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (newSearchText: SetStateAction<string>) => {
    // console.log({ newSearchText });
    setSearchText(newSearchText);
  };

  return { searchText, handleSearchChange };
};
