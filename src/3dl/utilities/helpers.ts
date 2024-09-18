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
    sanitizedSearchText ? `'%${sanitizedSearchText}%'` : "'%%'"
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
  let searchModifier = false;

  if (
    pageSize > 0 &&
    query.includes("{pageSize}") &&
    query.includes("{offset}")
  ) {
    modifiedQuery = buildPaginatedQuery(modifiedQuery, pageSize, offset);
    paginationModification = true;
  }

  if (query.includes("{searchTextCondition}")) {
    modifiedQuery = buildSearchQuery(modifiedQuery, searchText);
    if (searchText) {
      searchModifier = true;
    }
  }

  return { modifiedQuery, paginationModification, searchModifier };
};

export const useInfiniteScroll = (pageSize: number) => {
  const [infiniteScrollConfig, setInfiniteScrollConfig] = useState({
    pageIndex: 1,
  });

  const offset = (infiniteScrollConfig.pageIndex - 1) * pageSize;

  const nextPage = () => {
    setInfiniteScrollConfig((prevConfig) => ({
      ...prevConfig,
      pageIndex: prevConfig.pageIndex + 1,
    }));
  };

  const resetPage = () => {
    setInfiniteScrollConfig({
      pageIndex: 1,
    });
  };

  return {
    offset,
    nextPage,
    resetPage,
  };
};

export const useSearchText = (resetOffset: () => void) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (newSearchText: SetStateAction<string>) => {
    setSearchText(newSearchText);
    resetOffset();
  };

  return { searchText, handleSearchChange };
};
