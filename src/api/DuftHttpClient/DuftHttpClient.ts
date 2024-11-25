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
  private getRefreshToken: () => string | undefined;
  private setAuthToken: (
    accessToken: string | null,
    refreshToken: string | null
  ) => void;
  private updateConfig: ((config: Config) => void) | undefined;
  private isRefreshing = false;

  // Array of public routes
  private readonly publicRoutes = ["/token", "/get-current-config"];

  constructor(
    baseUrl: string,
    getAuthToken?: () => string | undefined,
    setAuthToken?: (
      accessToken: string | null,
      refreshToken: string | null
    ) => void,
    updateConfig?: (config: Config) => void,
    getRefreshToken?: () => string | undefined
  ) {
    this.baseUrl = baseUrl;

    // Default implementations for the callbacks
    this.getAuthToken = getAuthToken || (() => undefined);
    this.getRefreshToken = getRefreshToken || (() => undefined);
    this.setAuthToken = setAuthToken || (() => {});
    this.updateConfig = updateConfig || (() => {});
  }

  private async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) return false;

    try {
      this.isRefreshing = true;
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        return false;
      }

      const response = await this.makeRequest(
        "POST",
        `${this.baseUrl}/token/refresh/`,
        {
          refresh: refreshToken,
        }
      );

      if (response.access) {
        this.setAuthToken(response.access, response.refresh);
        return true;
      }

      return false;
    } catch (error) {
      this.setAuthToken(null, null); // Clear tokens on refresh failure
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Generic method for making HTTP requests
  private async makeRequest(
    method: string,
    endpoint: string,
    body?: Record<string, any>,
    forceAuth?: boolean
  ): Promise<any> {
    const isPublicRoute = this.publicRoutes.some((route) =>
      endpoint.startsWith(`${this.baseUrl}${route}`)
    );

    // Use authentication if forced or if it's not a public route
    const useAuth = forceAuth || !isPublicRoute;
    const token = useAuth ? this.getAuthToken() : undefined;

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
          if (!endpoint.includes("/token/refresh/")) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              // Retry the original request with new token
              return this.makeRequest(method, endpoint, body, forceAuth);
            }
            //We may not need the logic in the `if` statement anymore, since the app will reload with a fresh token once setAuthToken is called.
          }
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
  async getCurrentConfig(useAuthentication: boolean = false): Promise<Config> {
    const response = await this.makeRequest(
      "GET",
      `${this.baseUrl}/get-current-config`,
      undefined,
      useAuthentication
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

    if (response.access && response.refresh) {
      this.setAuthToken(response.access, response.refresh);
    }

    return response;
  }

  async logout() {
    this.setAuthToken(null, null);
  }
}
