import { renderHook } from "@testing-library/react";
import { expect, test, beforeEach, vi } from "vitest";
import DataProvider from "../data-provider";
import { useDataContext } from "../../context/DataContext";
import OpenmrsData, { useOpenmrsFetch } from "../openmrs-api";
import { OpenMRSClient } from "../../../api/OpenmrsHttpClient/OpenmrsHttpClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PATIENT_ID = "03aa43ae-b8fa-40dc-8ded-d70f0ebd9255";
const BASE_URL = "https://dev3.openmrs.org/openmrs/ws/rest/v1";

let client: OpenMRSClient;

beforeEach(() => {
  client = new OpenMRSClient(BASE_URL);
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

test("OpenmrsData component fetches appointments data and updates DataProvider", async () => {
  const searchPayload = {
    startDate: "2025-01-20T00:00:00.000+0300",
    endDate: "2025-01-20T23:59:59.999+0300",
  };

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider>
          <OpenmrsData
            resource="appointments/search"
            client={client}
            queryKey="test-appointments"
            method="POST"
            body={searchPayload}
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  expect(result.current.data).toBeNull();
  expect(result.current.datasetParams.loading).toBe(true);

  await waitForState((state) => state !== null, result);

  // Verify appointments data structure
  expect(Array.isArray(result.current.data)).toBe(true);
  if (result.current.data?.length > 0) {
    const appointment = result.current.data[0];
    expect(appointment).toHaveProperty("uuid");
    expect(appointment).toHaveProperty("startDateTime");
    expect(appointment).toHaveProperty("endDateTime");
  }
  expect(result.current.datasetParams.loading).toBe(false);
}, 15000); // Increased timeout for API call

test("OpenmrsData component handles error states", async () => {
  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <OpenmrsData
            resource="patient"
            resourceId="invalid-uuid-that-doesnt-exist"
            client={client}
            queryKey="test-error"
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  await waitForState(
    (state) => result.current.datasetParams.error !== null,
    result
  );

  expect(result.current.data).toBeNull();
  expect(result.current.datasetParams.loading).toBe(false);
  expect(result.current.datasetParams.error).toBeTruthy();
}, 10000);

test("useOpenmrsFetch hook directly updates context", async () => {
  const { result } = renderHook(
    () => {
      const contextData = useDataContext();
      useOpenmrsFetch({
        resource: "patient",
        resourceId: PATIENT_ID,
        client,
        queryKey: "test-direct-hook",
      });
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

  await waitForState((state) => state !== null, result);

  // Verify real patient data structure
  expect(result.current.data).toHaveProperty("uuid");
  expect(result.current.data).toHaveProperty("person");
  expect(result.current.datasetParams.loading).toBe(false);
}, 10000);

test("OpenmrsData component handles parameters correctly", async () => {
  const params = {
    v: "full",
  };

  // Simply spy on the fetchResource method
  const fetchResourceSpy = vi.spyOn(client, "fetchResource");

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider pageSize={10}>
          <OpenmrsData
            resource="patient"
            resourceId={PATIENT_ID}
            client={client}
            params={params}
            queryKey="test-params"
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  await waitForState((state) => state !== null, result);

  // Verify the fetchResource was called with correct params
  expect(fetchResourceSpy).toHaveBeenCalledWith(
    `patient/${PATIENT_ID}`,
    params,
    "GET",
    undefined
  );

  // Clean up spy
  fetchResourceSpy.mockRestore();
}, 10000);

test("constructs URL correctly with resource and resourceId", async () => {
  const resourceSpy = vi.spyOn(client, "fetchResource");
  const resourceId = "test-uuid-123";

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider>
          <OpenmrsData
            resource="encounter"
            resourceId={resourceId}
            client={client}
            queryKey="test-url-construction"
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  // Verify the resource path is constructed correctly
  expect(resourceSpy).toHaveBeenCalledWith(
    `encounter/${resourceId}`,
    undefined,
    "GET",
    undefined
  );

  resourceSpy.mockRestore();
}, 15000);
