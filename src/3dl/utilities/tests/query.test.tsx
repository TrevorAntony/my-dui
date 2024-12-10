import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";
import { expect, test, beforeEach } from "vitest";
import { Dataset2, useDatasetContext } from "../Dataset2";
import QueryDataset from "../query2-component";
import useQueryData from "../../../3dlcomponents/resources/useQueryData";
import { DuftHttpClient } from "../../../api/DuftHttpClient/DuftHttpClient";

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

  const { result } = renderHook(() => useDatasetContext(), {
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

  // Track initial null state
  stateTransitions.push(result.current.data);
  expect(result.current.data).toBeNull();

  // Wait for data to load
  await waitForState((state) => state !== null && Array.isArray(state), result);

  // Track loaded state
  stateTransitions.push(result.current.data);

  // Verify state transitions
  expect(stateTransitions[0]).toBeNull();
  expect(stateTransitions[1].data).toBeInstanceOf(Array);
  expect(stateTransitions[1].data.length).toBeGreaterThan(0);

  // Verify we only had two state transitions: null -> data
  expect(stateTransitions.length).toBe(2);

  // Optional: Verify specific data properties if needed
  expect(result.current.data).toHaveProperty("data");

  // Verify context has all required properties
  expect(result.current.data).toHaveProperty("query");
  expect(result.current.data).toHaveProperty("loading");
  expect(result.current.data).toHaveProperty("pageSize");
  expect(result.current.data).toHaveProperty("searchColumns");
});
