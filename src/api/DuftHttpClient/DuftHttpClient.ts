import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  TeapotError,
  UnauthorizedError,
  UnknownHttpError,
} from "./ErrorClasses";
import type { Config } from "../../context/types";

export class DuftHttpClient {
  private baseUrl: string;
  private getAuthToken: () => string | undefined;
  private setAuthToken: (token: string) => void;
  private updateConfig: ((config: Config) => void) | undefined;

  // Array of public routes
  private readonly publicRoutes = ["/token"];

  constructor(
    baseUrl: string,
    getAuthToken?: () => string | undefined,
    setAuthToken?: (token: string) => void,
    updateConfig?: (config: Config) => void
  ) {
    this.baseUrl = baseUrl;

    // Default implementations for the callbacks
    this.getAuthToken = getAuthToken || (() => undefined);
    this.setAuthToken = setAuthToken || (() => {});
    this.updateConfig = updateConfig || (() => {});
  }

  // Generic method for making HTTP requests
  private async makeRequest(
    method: string,
    endpoint: string,
    body?: Record<string, any>
  ): Promise<any> {
    const isPublicRoute = this.publicRoutes.some((route) =>
      endpoint.startsWith(`${this.baseUrl}${route}`)
    );

    const token = isPublicRoute ? undefined : this.getAuthToken();
    // const token = this.getAuthToken();

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    // Handle errors using custom error classes
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null); // Fallback for non-JSON responses

      switch (response.status) {
        case 400:
          throw new BadRequestError(errorPayload);
        case 401:
          throw new UnauthorizedError(errorPayload);
        case 403:
          throw new ForbiddenError(errorPayload);
        case 404:
          throw new NotFoundError(errorPayload);
        case 418:
          throw new TeapotError(errorPayload);
        case 500:
        case 502:
        case 503:
        case 504:
          throw new ServerError(response.status, errorPayload);
        default:
          throw new UnknownHttpError(response.status, errorPayload);
      }
    }

    // Parse and return JSON response
    return await response.json();
  }

  // Public API methods
  async getCurrentConfig(): Promise<Config> {
    //add logic to fetch token from local storage and use it here.
    const response = await this.makeRequest(
      "GET",
      `${this.baseUrl}/get-current-config`
    );
    if (this.updateConfig) {
      this.updateConfig(response);
    }
    return response;
  }

  async getNavigationFile(): Promise<any> {
    return this.makeRequest("GET", `${this.baseUrl}/navigation`);
  }

  async getDashboardFile(myFile: string): Promise<any> {
    return this.makeRequest("GET", `${this.baseUrl}/3dldashboard/${myFile}`);
  }

  async getTheme(): Promise<any> {
    return this.makeRequest("GET", `${this.baseUrl}/theme`);
  }

  async getQueryData(requestPayload: Record<string, any>): Promise<any> {
    return this.makeRequest(
      "POST",
      `${this.baseUrl}/run-query`,
      requestPayload
    );
  }

  async runDataTask(taskPayload: Record<string, any>): Promise<any> {
    return this.makeRequest(
      "POST",
      `${this.baseUrl}/run-data-task`,
      taskPayload
    );
  }

  async login(username: string, password: string): Promise<any> {
    const response = await this.makeRequest("POST", `${this.baseUrl}/token/`, {
      username,
      password,
    });

    if (response.access) {
      this.setAuthToken(response.access);
    }

    return response;
  }

  async logout() {
    this.setAuthToken(null);
  }
}
