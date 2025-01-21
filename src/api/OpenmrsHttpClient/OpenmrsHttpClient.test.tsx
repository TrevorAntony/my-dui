import { expect, test, beforeEach, vi } from "vitest";
import { OpenMRSClient } from "./OpenmrsHttpClient";

const BASE_URL = "https://dev3.openmrs.org/openmrs/ws/rest/v1";

//If these tests fail then this patient was probably deleted 🥲
const PATIENT_ID = "48a7f255-d499-4741-a2b8-5941e83d91f2";
let client: OpenMRSClient;

beforeEach(() => {
  client = new OpenMRSClient(BASE_URL, true); // Enable test environment
});

test("searches appointments successfully (POST)", async () => {
  const searchPayload = {
    startDate: "2025-01-20T00:00:00.000+0300",
    endDate: "2025-01-20T23:59:59.999+0300",
  };

  const response = await client.fetchResource(
    "appointments/search",
    {},
    "POST",
    searchPayload
  );

  expect(response).toBeDefined();
  if (Array.isArray(response)) {
    response.forEach((appointment) => {
      expect(appointment.uuid).toBeDefined();
      expect(appointment.startDateTime).toBeDefined();
      expect(appointment.endDateTime).toBeDefined();
    });
  }
}, 15000);

test("fetches specific patient data successfully (GET)", async () => {
  const patientUuid = PATIENT_ID;
  const response = await client.fetchResource(`patient/${patientUuid}`, {
    v: "full",
  });

  expect(response).toBeDefined();
  expect(response.uuid).toBe(patientUuid);
  expect(response.person).toBeDefined();
  expect(response.person.uuid).toBeDefined();
  expect(response.person.display).toBeDefined();
  expect(response.identifiers).toBeDefined();
}, 15000);

test("handles invalid resources correctly", async () => {
  await expect(client.fetchResource("invalid-endpoint")).rejects.toThrow();
}, 15000);

test("sends requests with correct headers", async () => {
  // Store original fetch
  const originalFetch = global.fetch;

  try {
    // Setup temporary fetch mock just for this test
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    global.fetch = mockFetch;

    await client.fetchResource("patient", { limit: 1 });

    // Verify the headers in the request
    const requestInfo = mockFetch.mock.calls[0];
    const [url, options] = requestInfo;
    const headers = options.headers;

    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("Authorization")).toBe("Basic YWRtaW46QWRtaW4xMjM=");
    expect(url).toBe(`${BASE_URL}/patient?limit=1`);
  } finally {
    // Restore original fetch
    global.fetch = originalFetch;
  }
}, 15000);

test("constructs URLs with parameters correctly", async () => {
  const originalFetch = global.fetch;

  try {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    global.fetch = mockFetch;

    // Test multiple parameters including special characters
    await client.fetchResource("patient", {
      q: "John Doe",
      v: "full",
      limit: 10,
      includeAll: true,
      fromDate: "2023-01-01",
      complexParam: "test&special=true",
    });

    const requestInfo = mockFetch.mock.calls[0];
    const [url] = requestInfo;

    // Verify all parameters are present and encoded correctly
    expect(url).toContain(`${BASE_URL}/patient?`);
    expect(url).toContain("q=John+Doe");
    expect(url).toContain("v=full");
    expect(url).toContain("limit=10");
    expect(url).toContain("includeAll=true");
    expect(url).toContain("fromDate=2023-01-01");
    expect(url).toContain("complexParam=test%26special%3Dtrue");

    // Verify parameter separator
    const paramCount = (url.match(/&/g) || []).length;
    expect(paramCount).toBe(5); // Should have 5 & separators for 6 parameters
  } finally {
    global.fetch = originalFetch;
  }
}, 15000);

test("handles API errors gracefully", async () => {
  // Test with a non-existent endpoint that should return a 404
  await expect(
    client.fetchResource("nonexistent/endpoint/12345")
  ).rejects.toThrow("Error fetching nonexistent/endpoint/12345");

  // Test with malformed UUID that should return an error
  await expect(
    client.fetchResource("patient/invalid-uuid-format")
  ).rejects.toThrow("Error fetching patient/invalid-uuid-format");

  // Test with invalid HTTP method
  await expect(
    client.fetchResource(
      "patient",
      {},
      "POST", // POST to a GET-only endpoint
      { invalidData: true }
    )
  ).rejects.toThrow();
}, 15000);

test("includes status code and error details in error messages", async () => {
  // Test 404 Not Found
  try {
    await client.fetchResource("patient/non-existent-uuid");
    fail("Expected error was not thrown");
  } catch (error: any) {
    expect(error.message).toContain("Status 404");
  }

  // Test 400 Bad Request with malformed UUID
  try {
    await client.fetchResource("patient");
    fail("Expected error was not thrown");
  } catch (error: any) {
    expect(error.message).toContain("Status 400");
  }
}, 15000);

test("fetchPatient method calls fetchResource with correct parameters", async () => {
  const originalFetch = global.fetch;
  const patientId = "test-patient-id";

  try {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ uuid: patientId }),
    });
    global.fetch = mockFetch;

    const result = await client.fetchPatient(patientId);

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/patient/${patientId}`,
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      })
    );
    expect(result).toEqual({ uuid: patientId });
  } finally {
    global.fetch = originalFetch;
  }
}, 15000);

test("fetchEncounter method calls fetchResource with correct parameters", async () => {
  const originalFetch = global.fetch;
  const encounterId = "test-encounter-id";

  try {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ uuid: encounterId }),
    });
    global.fetch = mockFetch;

    const result = await client.fetchEncounter(encounterId);

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/encounter/${encounterId}`,
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      })
    );
    expect(result).toEqual({ uuid: encounterId });
  } finally {
    global.fetch = originalFetch;
  }
}, 15000);

test("fetchPatient method fetches real patient data", async () => {
  const patientId = PATIENT_ID;
  const result = await client.fetchPatient(patientId);

  expect(result).toBeDefined();
  expect(result.uuid).toBe(patientId);
  expect(result.person).toBeDefined();
  expect(result.person.uuid).toBeDefined();
  expect(result.identifiers).toBeDefined();
}, 15000);

test("fetchPatientsFromAppointments returns array of patients", async () => {
  const startDate = "2025-01-20T00:00:00.000+0300";
  const endDate = "2025-01-20T23:59:59.999+0300";

  const patients = await client.fetchPatientsFromAppointments(
    startDate,
    endDate
  );

  expect(Array.isArray(patients)).toBe(true);
  if (patients.length > 0) {
    patients.forEach((patient) => {
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

test("fetchPatientsFromAppointments handles errors correctly", async () => {
  const startDate = "invalid-date";
  const endDate = "invalid-date";

  await expect(
    client.fetchPatientsFromAppointments(startDate, endDate)
  ).rejects.toThrow();
}, 15000);

test("fetchPatientsFromAppointments calls fetchResource with correct parameters", async () => {
  const originalFetch = global.fetch;
  const startDate = "2025-01-20T00:00:00.000+0300";
  const endDate = "2025-01-20T23:59:59.999+0300";

  try {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            patient: {
              OpenMRSID: "test-id",
              identifier: "test-id",
              gender: "M",
              name: "Test Patient",
              uuid: "test-uuid",
              age: 30,
            },
          },
        ]),
    });
    global.fetch = mockFetch;

    const result = await client.fetchPatientsFromAppointments(
      startDate,
      endDate
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/appointments/search`,
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Headers),
        body: JSON.stringify({ startDate, endDate }),
      })
    );

    expect(result).toEqual([
      {
        OpenMRSID: "test-id",
        identifier: "test-id",
        gender: "M",
        name: "Test Patient",
        uuid: "test-uuid",
        age: 30,
      },
    ]);
  } finally {
    global.fetch = originalFetch;
  }
}, 15000);
