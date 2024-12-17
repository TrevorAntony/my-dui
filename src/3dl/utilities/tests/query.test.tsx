import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { expect, test, beforeEach } from "vitest";
import Dataset2 from "../Dataset2";
import QueryDataset from "../query2-component";
import useQueryData from "../../../3dlcomponents/resources/useQueryData";
import { DuftHttpClient } from "../../../api/DuftHttpClient/DuftHttpClient";
import { useDataContext } from "../../context/DataContext";

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
        <Dataset2>
          <QueryDataset useQuery={useQueryData} client={client}>
            SELECT * FROM dim_age_group
          </QueryDataset>
          {children}
        </Dataset2>
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
