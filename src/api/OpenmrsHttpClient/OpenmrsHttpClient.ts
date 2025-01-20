import { extractErrorMessage } from "../../helpers/visual-helpers";

export class OpenMRSClient {
  private baseURL: string;
  private headers: Headers;
  private static readonly USERNAME = "admin";
  private static readonly PASSWORD = "Admin123";

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${this.getBasicAuthToken()}`,
    });
  }

  private getBasicAuthToken(): string {
    const credentials = `${OpenMRSClient.USERNAME}:${OpenMRSClient.PASSWORD}`;
    return Buffer.from(credentials).toString("base64");
  }

  async fetchResource(
    resource: string,
    params = {},
    method: "GET" | "POST" = "GET",
    body?: object
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

      return await response.json();
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
}

export default new OpenMRSClient("https://dev3.openmrs.org/openmrs/ws/rest/v1");
