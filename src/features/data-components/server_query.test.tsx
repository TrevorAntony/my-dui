import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { expect, test, beforeEach } from "vitest";
import DataProvider from "./data-provider/data-provider";
import ServerQueryData from "./server-query-data";
import useQueryData from "./hooks/useQueryData";
import { DuftHttpClient } from "../../../api/DuftHttpClient/DuftHttpClient";
import { useDataContext } from "../../context/DataContext";
import useDataSetLogic from "./hooks/useDataSetLogic";

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
      if (condition(result.current?.data?.data)) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
};

test("ServerQueryData context state transitions", async () => {
  const stateTransitions: any[] = [];
  const testQueryClient = createTestQueryClient();
  const queryName = "filters/age_group";

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <ServerQueryData
            queryName={queryName}
            useQuery={useQueryData}
            client={client}
          />
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
    loading: true,
  });

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
});

test("ServerQueryData filtering functionality", async () => {
  const testQueryClient = createTestQueryClient();
  const queryName = "filters/age_group";
  const searchText = "10";
  const searchColumns = "age";

  const { result } = renderHook(
    () =>
      useDataSetLogic({
        queryName,
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
            <ServerQueryData
              queryName={queryName}
              useQuery={useQueryData}
              client={client}
            />
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Wait for query to complete
  await waitForState((state) => state !== null, result);

  // Verify filtering
  expect(result.current.data).toBeDefined();
  expect(result.current.data!.length).toBeGreaterThan(0);

  // Verify each filtered row contains the search text
  result.current.data?.forEach((row) => {
    const rowString = JSON.stringify(row).toLowerCase();
    expect(rowString).toContain(searchText);
  });
});

test("ServerQueryData sorting functionality", async () => {
  const testQueryClient = createTestQueryClient();
  const queryName = "filters/age_group";

  //Test ascending sort
  const { result: ascResult } = renderHook(
    () =>
      useDataSetLogic({
        queryName,
        useQuery: useQueryData,
        sortColumn: "age_group_id ASC",
        debug: false,
        client,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider>
            <ServerQueryData
              queryName={queryName}
              useQuery={useQueryData}
              client={client}
            />
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Wait for query to complete
  await waitForState((state) => state !== null, ascResult);

  // Verify sorting
  const ids = ascResult.current.data!.map((row) => row.age_group_id);
  expect([...ids]).toEqual(ids.sort((a, b) => a - b));
});

test("ServerQueryData pagination", async () => {
  const testQueryClient = createTestQueryClient();
  const queryName = "filters/age_group";
  const pageSize = 5;

  const { result } = renderHook(
    () =>
      useDataSetLogic({
        queryName,
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
            <ServerQueryData
              queryName={queryName}
              useQuery={useQueryData}
              client={client}
            />
            {children}
          </DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Wait for query to complete
  await waitForState((state) => state !== null, result);

  console.log(result.current.data?.length);
  // Verify pagination
  expect(result.current.data).toBeDefined();
  expect(result.current.data!.length).toBeLessThanOrEqual(pageSize);
  expect(result.current.error).toBeNull();
  expect(result.current.loading).toBe(false);
});
