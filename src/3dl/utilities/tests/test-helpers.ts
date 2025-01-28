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
