import { renderHook } from "@testing-library/react";
import { expect, test, beforeEach } from "vitest";
import DataProvider from "../data-provider/data-provider";
import { useDataContext } from "../../../core/context/DataContext";
import API, { useApiFetch } from "./api";
import { DuftHttpClient } from "../../../core/api/DuftHttpClient/DuftHttpClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const API_URL = "https://jsonplaceholder.typicode.com/users";
const BASE_URL = "http://127.0.0.1:8000/api/v2";

let client: DuftHttpClient;

beforeEach(() => {
  client = new DuftHttpClient(BASE_URL);
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const testQueryClient = createTestQueryClient();

const waitForState = (condition: (state: any) => boolean, result: any) => {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (condition(result.current.data)) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
};

test("API component fetches and updates DataProvider with real data", async () => {
  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <API url={API_URL} client={client} queryKey="test-data" />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  // Verify initial state
  expect(result.current.data).toBeNull();
  expect(result.current.datasetParams.loading).toBe(true);

  // Wait for data load
  await waitForState((state) => state !== null, result);

  // Verify loaded state
  expect(Array.isArray(result.current.data)).toBe(true);
  expect(result.current.data.length).toBeGreaterThan(0);
  expect(result.current.datasetParams.loading).toBe(false);
});

test("API component handles error states with invalid URL", async () => {
  const invalidUrl = "https://invalid-url-that-will-fail.com";

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <API url={invalidUrl} client={client} queryKey="test-data" />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  // Wait for error state
  await waitForState(() => result.current.datasetParams.error !== null, result);

  // Verify error state
  expect(result.current.data).toBeNull();
  expect(result.current.datasetParams.loading).toBe(false);
  expect(result.current.datasetParams.error).toBeTruthy();
});

test("useApiFetch hook directly updates context", async () => {
  const { result } = renderHook(
    () => {
      const contextData = useDataContext();
      useApiFetch({ url: API_URL, client });
      return contextData;
    },
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <DataProvider pageSize={10}>{children}</DataProvider>
        </QueryClientProvider>
      ),
    }
  );

  // Verify initial state
  expect(result.current.data).toBeNull();
  expect(result.current.datasetParams.loading).toBe(true);

  // Wait for data load
  await waitForState((state) => state !== null, result);

  // Verify loaded state
  expect(Array.isArray(result.current.data)).toBe(true);
  expect(result.current.data.length).toBeGreaterThan(0);
  expect(result.current.datasetParams.loading).toBe(false);
});

test("API component handles URL parameters correctly", async () => {
  const testParams = {
    userId: 1,
    _limit: 2,
  };

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <API
            url={API_URL}
            client={client}
            queryKey="test-params"
            params={testParams}
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  // Wait for data load
  await waitForState((state) => state !== null, result);

  // Verify loaded state
  expect(Array.isArray(result.current.data)).toBe(true);
  // Should only return 2 items due to _limit param
  expect(result.current.data.length).toBe(2);
  // First item should have userId 1
  expect(result.current.data[0].id).toBe(1);
  expect(result.current.datasetParams.loading).toBe(false);
});
