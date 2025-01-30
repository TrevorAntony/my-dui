import { OpenMRSClient } from "../../../api/OpenmrsHttpClient/OpenmrsHttpClient";
import { patientExtractor } from "../openmrs-api/openmrs-api-utils";

export const getPatientFromAppointments = async (
  client: OpenMRSClient
): Promise<string> => {
  const searchPayload = {
    startDate: "2000-01-20T00:00:00.000+0300",
    endDate: "2025-01-26T23:59:59.999+0300",
  };

  try {
    const response = await client.fetchResource(
      "appointments/search",
      {},
      "POST",
      searchPayload
    );

    const patients = patientExtractor(response);

    if (!patients?.length) {
      throw new Error("No patients found in appointments");
    }

    return patients[0].uuid;
  } catch (error) {
    console.error("Failed to fetch patient from appointments:", error);
    throw error;
  }
};

export const getTestPatient = async (
  client: OpenMRSClient
): Promise<string> => {
  try {
    // Try to get patient from appointments first
    const patientId = await getPatientFromAppointments(client);
    console.log("Using test patient from appointments with UUID:", patientId);
    return patientId;
  } catch (error) {
    // Fallback to fetching any patient if appointments method fails
    try {
      const response = await client.fetchResource("patient", {
        v: "default",
        limit: 1,
      });
      if (!response?.results?.[0]?.uuid) {
        throw new Error("No patients found in the system");
      }
      const patientId = response.results[0].uuid;
      console.log("Using fallback test patient with UUID:", patientId);
      return patientId;
    } catch (fallbackError) {
      console.error("All patient fetch methods failed:", fallbackError);
      // Last resort fallback
      const hardcodedId = "8673ee4f-e2ab-4077-ba55-4980f408773e";
      console.log("Using hardcoded fallback UUID:", hardcodedId);
      return hardcodedId;
    }
  }
};

export const makeAuthenticatedRequest = async (
  endpoint: string,
  token?: string,
  method: "GET" | "POST" = "GET",
  body?: Record<string, any>
): Promise<any> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Request failed: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  return response.json();
};

export const mockConfig = {
  features: {
    user_authentication: false,
    data_tasks: false,
    log_level: "INFO",
    server_uploads: false,
    task_scheduler: false,
  },
  currentUser: null,
  currentUserPermissions: [],
  currentUserRoles: [],
  settings: {
    name: "Test Instance",
    appName: "DUFT Test",
    footer: "Test Footer",
    custom: "custom-value",
    version: "1.0.0",
    logoURL: "https://example.com/logo.png",
    repository: "https://github.com/example/repo",
    credits: {
      organisaton: "Test Org",
      department: "Test Department",
      website: "https://example.com",
      productOwners: ["Owner 1", "Owner 2"],
      developers: ["Dev 1", "Dev 2"],
    },
    additionalInfo: "Additional test information",
    theme: {}, // Additional custom setting
    layout: {}, // Additional custom setting
  },
  version: "1.0.0",
  serverBaseURL: "http://localhost:8000",
  pythonPath: "/usr/bin/python",
  pythonVersion: "3.8.0",
  directories: {},
};
