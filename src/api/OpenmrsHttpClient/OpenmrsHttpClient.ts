import { extractErrorMessage } from "../../helpers/visual-helpers";

interface Patient {
  OpenMRSID: string;
  identifier: string;
  gender: string;
  name: string;
  uuid: string;
  age: number;
}
//TO-DO: move this to a helper file, accessible via a hashmap whose key will be passed via 3DL
export const patientExtractor = (appointments: any[]): Patient[] => {
  return appointments.map((appointment) => appointment.patient);
};

export class OpenMRSClient {
  private baseURL: string;
  private headers: Headers;
  private static readonly USERNAME = "admin";
  private static readonly PASSWORD = "Admin123";

  constructor(baseURL: string, testEnv: boolean = false) {
    //TO-DO add proxy support for multiple URLs,
    // this can be defined as a map and keys passed as props from 3DL
    this.baseURL = testEnv ? baseURL : "/omrsProxy";
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${this.getBasicAuthToken()}`,
    });
  }

  private getBasicAuthToken(): string {
    const credentials = `${OpenMRSClient.USERNAME}:${OpenMRSClient.PASSWORD}`;
    return btoa(credentials);
  }

  async fetchResource(
    resource: string,
    params = {},
    method: "GET" | "POST" = "GET",
    body?: object,
    transformData?: string | boolean
  ) {
    const query = new URLSearchParams(params).toString();
    const url = `${this.baseURL}/${resource}${query ? `?${query}` : ""}`;

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Error fetching ${resource}: Status ${
            response.status
          } - ${extractErrorMessage(errorBody)}`
        );
      }

      const responseData = await response.json();
      return transformData ? patientExtractor(responseData) : responseData;
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  }

  async fetchPatient(patientId: string) {
    return this.fetchResource(`patient/${patientId}`);
  }

  async fetchEncounter(encounterId: string) {
    return this.fetchResource(`encounter/${encounterId}`);
  }

  async fetchPatientsFromAppointments(startDate: string, endDate: string) {
    const searchPayload = {
      startDate,
      endDate,
    };

    return this.fetchResource(
      "appointments/search",
      {},
      "POST",
      searchPayload,
      true // Enable transformation
    );
  }
}
