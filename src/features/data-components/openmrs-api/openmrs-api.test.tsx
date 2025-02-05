import { renderHook } from "@testing-library/react";
import { expect, test, beforeAll, vi } from "vitest";
import DataProvider from "../data-provider/data-provider";
import { useDataContext } from "../../../core/context/DataContext";
import OpenmrsData, { useOpenmrsFetch } from "./openmrs-api";
import { OpenMRSClient } from "../../../core/api/OpenmrsHttpClient/OpenmrsHttpClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTestPatient } from "../../../utils/test-utilities/test-helpers";

const BASE_URL = "https://dev3.openmrs.org/openmrs/ws/rest/v1";
let PATIENT_ID: string;
let client: OpenMRSClient;

beforeAll(async () => {
  client = new OpenMRSClient(BASE_URL, true);
  PATIENT_ID = await getTestPatient(client);
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
    (_state) => result.current.datasetParams.error !== null,
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
}, 15000);

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
            adapter="test-adapter"
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
    undefined,
    "test-adapter"
  );

  // Clean up spy
  fetchResourceSpy.mockRestore();
}, 15000);

test("constructs URL correctly with resource and resourceId", async () => {
  const resourceSpy = vi.spyOn(client, "fetchResource");
  const resourceId = "test-uuid-123";

  renderHook(() => useDataContext(), {
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
    undefined,
    undefined
  );

  resourceSpy.mockRestore();
}, 15000);

test("OpenmrsData component uses adapter correctly", async () => {
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
            queryKey="test-adapter"
            method="POST"
            body={searchPayload}
            adapter="patientsFromAppointments"
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  await waitForState((state) => state !== null, result);

  // Verify the data was transformed by the patient adapter
  if (result.current.data?.length > 0) {
    result.current.data.forEach((patient: any) => {
      expect(patient).toMatchObject({
        OpenMRSID: expect.any(String),
        identifier: expect.any(String),
        gender: expect.any(String),
        name: expect.any(String),
        uuid: expect.any(String),
        age: expect.any(Number),
      });
    });
  }
}, 15000);

test("OpenmrsData component works without adapter", async () => {
  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider>
          <OpenmrsData
            resource="patient"
            resourceId={PATIENT_ID}
            client={client}
            queryKey="test-no-adapter"
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  await waitForState((state) => state !== null, result);

  // Verify raw data structure is preserved
  expect(result.current.data).toHaveProperty("uuid");
  expect(result.current.data).toHaveProperty("person");
}, 15000);

test("OpenmrsData component handles invalid adapter keys", async () => {
  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider>
          <OpenmrsData
            resource="patient"
            resourceId={PATIENT_ID}
            client={client}
            queryKey="test-invalid-adapter"
            adapter="non-existent-adapter"
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  await waitForState((state) => state !== null, result);

  // Verify raw data is returned when adapter is not found
  expect(result.current.data).toHaveProperty("uuid");
  expect(result.current.data).toHaveProperty("person");
}, 15000);

test("OpenmrsData component handles multiple invalid adapter scenarios", async () => {
  const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  const { result } = renderHook(() => useDataContext(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <DataProvider>
          {/* Test multiple components with different invalid adapters */}
          <OpenmrsData
            resource="patient"
            resourceId={PATIENT_ID}
            client={client}
            queryKey="test-invalid-adapter-1"
            adapter="invalid-adapter-1"
          />
          <OpenmrsData
            resource="patient"
            resourceId={PATIENT_ID}
            client={client}
            queryKey="test-invalid-adapter-2"
            adapter="invalid-adapter-2"
          />
          {children}
        </DataProvider>
      </QueryClientProvider>
    ),
  });

  await waitForState((state) => state !== null, result);

  // Verify warnings were logged for each invalid adapter
  expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    expect.stringContaining("invalid-adapter-1")
  );
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    expect.stringContaining("invalid-adapter-2")
  );

  // Verify the application continues to function with raw data
  expect(result.current.data).toHaveProperty("uuid");
  expect(result.current.data).toHaveProperty("person");
  expect(result.current.datasetParams.loading).toBe(false);
  expect(result.current.datasetParams.error).toBeNull();

  consoleWarnSpy.mockRestore();
}, 15000);
