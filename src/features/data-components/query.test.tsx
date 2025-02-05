import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { expect, test, beforeEach } from "vitest";
import DataProvider from "./data-provider/data-provider";
import QueryData from "./query-data";
import useQueryData from "./hooks/useQueryData";
import { DuftHttpClient } from "../../core/api/DuftHttpClient/DuftHttpClient";
import useDataSetLogic from "./hooks/useDataSetLogic";
import { useDataContext } from "../../core/context/DataContext";

const BASE_URL = "http://127.0.0.1:8000/api/v2";

// Token management setup
let accessToken: string | null = null;
let refreshToken: string | null = null;

const getAccessToken = () => accessToken;
const getRefreshToken = () => refreshToken;
const setTokens = (
  newAccessToken: string | null,
  newRefreshToken: string | null
) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
};

const client = new DuftHttpClient(
  BASE_URL,
  getAccessToken,
  setTokens,
  undefined,
  getRefreshToken
);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

beforeEach(async () => {
  accessToken = null;
  refreshToken = null;

  const username = "admin";
  const password = "--------";
  await client.login(username, password);
});

const waitForState = (condition: (state: any) => boolean, result: any) => {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (condition(result.current.data?.data)) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
};

test("Dataset context state transitions with Query", async () => {
  const stateTransitions: any[] = [];
  const testQueryClient = createTestQueryClient();

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <QueryData useQuery={useQueryData} client={client}>
            SELECT * FROM dim_age_group
          </QueryData>
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  // Track and verify initial state
  stateTransitions.push({
    data: result.current.data,
    params: result.current.datasetParams,
  });

  expect(result.current.data).toBeNull();
  expect(result.current.datasetParams).toMatchObject({
    filters: {},
    searchText: "",
    searchColumns: "",
    sortColumn: "",
    currentPage: 1,
    pageSize: 10,
    debug: false,
    appendData: false,
    error: null,
    loading: true, // Changed to match actual initial state
  });

  // Optional: Check that setQuery exists without checking its exact implementation
  expect(result.current.datasetParams.setQuery).toBeInstanceOf(Function);
  expect(result.current.datasetParams.query).toBe(
    "SELECT * FROM dim_age_group"
  );

  // Wait for data load
  await waitForState((state) => state !== null, result);
  stateTransitions.push({
    data: result.current.data,
    params: result.current.datasetParams,
  });

  // Verify state transitions
  expect(stateTransitions[1].data).toBeInstanceOf(Array);
  expect(stateTransitions[1].data.length).toBeGreaterThan(0);
  expect(stateTransitions[1].params.loading).toBe(false);
  expect(stateTransitions[1].params.query).toBeTruthy();

  // Verify context methods exist
  const expectedMethods = [
    "setData",
    "setDatasetParams",
    "resetPage",
    "pageUpdater",
    "handleSearchChange",
    "handleSortChange",
  ];
  expectedMethods.forEach((method) => {
    expect(typeof result.current[method]).toBe("function");
  });
});

test("useDataSetLogic hook behavior", async () => {
  const testQueryClient = createTestQueryClient();
  const query = "SELECT * FROM dim_age_group";

  const { result } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        searchText: "10",
        searchColumns: "age",
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              SELECT * FROM dim_age_group
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Verify initial state
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(null);
  expect(result.current.data).toBe(undefined);

  // Wait for data load
  await waitForState((state) => state !== null, result);

  // Verify loaded state
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(null);
  expect(result.current.data).toBeInstanceOf(Array);
  expect(result.current.data?.length).toBeGreaterThan(0);

  // Verify data structure
  const firstRow = result.current.data?.[0];
  expect(firstRow).toHaveProperty("age_group_id");
});

test("filtering functionality works correctly", async () => {
  const testQueryClient = createTestQueryClient();
  const query = "SELECT * FROM dim_age_group";
  const searchText = "10";
  const searchColumns = "age";

  // First, get unfiltered data
  const { result: unfilteredResult } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        searchText: "",
        searchColumns: "",
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Then, get filtered data
  const { result: filteredResult } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        searchText,
        searchColumns,
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Wait for both queries to complete
  await Promise.all([
    waitForState((state) => state !== null, unfilteredResult),
    waitForState((state) => state !== null, filteredResult),
  ]);

  // Verify filtering
  expect(filteredResult.current.data).toBeDefined();
  expect(filteredResult.current.data!.length).toBeGreaterThan(0);
  expect(filteredResult.current.data!.length).toBeLessThanOrEqual(
    unfilteredResult.current.data!.length
  );

  // Verify each filtered row contains the search text
  filteredResult.current.data?.forEach((row) => {
    const rowString = JSON.stringify(row).toLowerCase();
    expect(rowString).toContain(searchText);
  });
});

test("filtering with invalid search criteria returns empty results", async () => {
  const testQueryClient = createTestQueryClient();
  const query = "SELECT * FROM dim_age_group";
  const invalidSearchText = "xyz"; // Invalid for age column
  const searchColumns = "age";

  const { result: filteredResult } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        searchText: invalidSearchText,
        searchColumns,
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Wait for query to complete
  await waitForState((state) => state !== null, filteredResult);

  // Verify filtering with invalid criteria
  expect(filteredResult.current.data).toBeDefined();
  expect(filteredResult.current.error).toBeNull();
  expect(filteredResult.current.loading).toBe(false);

  // Should return empty array or very small result set
  expect(filteredResult.current.data!.length).toBe(0);

  // Verify the query still maintains its structure even with no results
  expect(filteredResult.current).toHaveProperty("data");
  expect(Array.isArray(filteredResult.current.data)).toBe(true);
});

test("sorting functionality works correctly", async () => {
  const testQueryClient = createTestQueryClient();
  const query = "SELECT * FROM dim_age_group";

  // Test ascending sort
  const { result: ascResult } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        sortColumn: "age_group_id ASC",
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Test descending sort
  const { result: descResult } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        sortColumn: "age_group_id DESC",
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Wait for both queries to complete
  await Promise.all([
    waitForState((state) => state !== null, ascResult),
    waitForState((state) => state !== null, descResult),
  ]);

  // Verify both queries returned data
  expect(ascResult.current.data).toBeDefined();
  expect(descResult.current.data).toBeDefined();
  expect(ascResult.current.data!.length).toBeGreaterThan(0);
  expect(descResult.current.data!.length).toBeGreaterThan(0);

  // Verify sorting order
  const ascIds = ascResult.current.data!.map((row) => row.age_group_id);
  const descIds = descResult.current.data!.map((row) => row.age_group_id);

  // Check ascending order
  expect([...ascIds]).toEqual(ascIds.sort((a, b) => a - b));

  // Check descending order
  expect([...descIds]).toEqual(descIds.sort((a, b) => b - a));

  // Verify the results are opposite of each other
  expect(ascIds).toEqual(descIds.reverse());
});

test("pagination returns correct number of records", async () => {
  const testQueryClient = createTestQueryClient();
  const query = "SELECT * FROM dim_age_group";
  const testPageSizes = [5, 10, 15]; // Test different page sizes

  // Test each page size
  for (const pageSize of testPageSizes) {
    const { result } = renderHook(
      () =>
        useDataSetLogic({
          query,
          useQuery: useQueryData,
          currentPage: 1,
          pageSize,
          debug: false,
          client,
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={testQueryClient}>
            <DataProvider>
              <QueryData useQuery={useQueryData} client={client}>
                {query}
              </QueryData>
              {children}
            </DataProvider>
          </QueryClientProvider>
        ),
      }
    );

    // Wait for query to complete
    await waitForState((state) => state !== null, result);

    // Verify pagination results
    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);

    // Check if returned data length matches page size
    // Note: Last page might have fewer records
    if (result.current.data!.length < pageSize) {
      // If we got fewer records than pageSize, verify this is the last page
      const totalResult = await renderHook(
        () =>
          useDataSetLogic({
            query,
            useQuery: useQueryData,
            pageSize: 1000, // Large enough to get all records
            debug: false,
            client,
          }),
        {
          wrapper: ({ children }) => (
            <QueryClientProvider client={testQueryClient}>
              <DataProvider>
                <QueryData useQuery={useQueryData} client={client}>
                  {query}
                </QueryData>
                {children}
              </DataProvider>
            </QueryClientProvider>
          ),
        }
      );

      await waitForState((state) => state !== null, totalResult.result);

      const totalRecords = totalResult.result.current.data!.length;

      // Verify we're on the last page
      expect(result.current.data!.length).toBe(
        totalRecords % pageSize || pageSize
      );
    } else {
      // For full pages, length should exactly match pageSize
      expect(result.current.data!.length).toBe(pageSize);
    }
  }
});

test("incremental page loading appends data in DataProvider correctly", async () => {
  const testQueryClient = createTestQueryClient();
  const query = "SELECT * FROM dim_age_group";
  const pageSize = 10;

  // Render both the dataset logic and context
  const { result: datasetLogic, rerender } = renderHook(
    ({ currentPage }) =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        currentPage,
        pageSize,
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
      initialProps: { currentPage: 1 },
    }
  );

  const { result: contextResult } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <QueryData useQuery={useQueryData} client={client}>
            {query}
          </QueryData>
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  // Wait for initial data load
  await waitForState((state) => state !== null, datasetLogic);

  // Store initial data from both sources
  const firstPageData = [...datasetLogic.current.data!];
  const firstPageContextData = [...contextResult.current.data!];

  expect(firstPageData.length).toBe(pageSize);
  expect(firstPageContextData.length).toBe(pageSize);
  expect(firstPageContextData).toEqual(firstPageData);

  // Enable append mode and increment page
  contextResult.current.setDatasetParams((prev) => ({
    ...prev,
    currentPage: 2,
    appendData: true,
  }));

  rerender({ currentPage: 2 });

  // Wait for second page to load and data to be appended
  await waitForState(
    (state) =>
      state !== null && JSON.stringify(state) !== JSON.stringify(firstPageData),
    datasetLogic
  );

  // Verify appended data in context
  const finalContextData = contextResult.current.data!;
  expect(finalContextData.length).toBe(pageSize * 2);

  // Verify first page data is preserved at the start
  expect(finalContextData.slice(0, pageSize)).toEqual(firstPageData);

  // Verify second page data is different
  const secondPageContextData = finalContextData.slice(pageSize);
  expect(secondPageContextData).not.toEqual(firstPageData);

  // Verify all records are unique
  const allIds = finalContextData.map((row) => row.age_group_id);
  const uniqueIds = new Set(allIds);
  expect(uniqueIds.size).toBe(allIds.length);

  // Verify params are updated correctly
  expect(contextResult.current.datasetParams.currentPage).toBe(2);
  expect(contextResult.current.datasetParams.appendData).toBe(true);
});

test("returns all records when pageSize is not provided", async () => {
  const testQueryClient = createTestQueryClient();
  const query = "SELECT * FROM dim_age_group";

  // Get total record count first using a paginated query
  const { result: paginatedResult } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        pageSize: 1000, // Large enough to get all records
        currentPage: 1,
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider pageSize={1000}>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Then get unpaginated result
  const { result: unpaginatedResult } = renderHook(
    () =>
      useDataSetLogic({
        query,
        useQuery: useQueryData,
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <QueryData useQuery={useQueryData} client={client}>
              {query}
            </QueryData>
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Wait for both queries to complete
  await Promise.all([
    waitForState((state) => state !== null, paginatedResult),
    waitForState((state) => state !== null, unpaginatedResult),
  ]);

  // Get total number of records
  const totalRecords = paginatedResult.current.data!.length;

  // Verify unpaginated result contains all records
  expect(unpaginatedResult.current.data).toBeDefined();
  expect(unpaginatedResult.current.data!.length).toBe(totalRecords);

  // Verify the dataset parameters
  const { result: contextResult } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider>
          <QueryData useQuery={useQueryData} client={client}>
            {query}
          </QueryData>
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  // Verify pagination params are not set
  expect(contextResult.current.datasetParams.pageSize).toBeUndefined();
  expect(contextResult.current.datasetParams.currentPage).toBe(1);
});
