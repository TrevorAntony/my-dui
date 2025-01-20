import { expect, test, beforeEach, vi } from "vitest";
import { OpenMRSClient } from "./OpenmrsHttpClient";

const BASE_URL = "https://dev3.openmrs.org/openmrs/ws/rest/v1";
let client: OpenMRSClient;

beforeEach(() => {
  client = new OpenMRSClient(BASE_URL);
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
  const patientUuid = "6742ca0d-866f-4ae2-92bc-38dfab896512";
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
