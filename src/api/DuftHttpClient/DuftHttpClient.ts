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
  private static instance: DuftHttpClient | null = null;

  private baseUrl: string;
  private getAuthToken: () => string | undefined;
  private getRefreshToken: () => string | undefined;
  private setAuthToken: (
    accessToken: string | null,
    refreshToken: string | null,
    autoUpdateConfig?: boolean
  ) => void;
  private updateConfig: ((config: Config) => void) | undefined;

  private readonly publicRoutes = [
    "/token",
    "/token/refresh",
    "/get-current-config",
  ];

  // Shared promise to handle token refresh concurrency
  private refreshTokenPromise: Promise<void> | null = null;

  public constructor(
    baseUrl: string,
    getAuthToken?: () => string | undefined,
    setAuthToken?: (
      accessToken: string | null,
      refreshToken: string | null,
      autoUpdateConfig?: boolean
    ) => void,
    updateConfig?: (config: Config) => void,
    getRefreshToken?: () => string | undefined
  ) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken || (() => undefined);
    this.getRefreshToken = getRefreshToken || (() => undefined);
    this.setAuthToken = setAuthToken || (() => {});
    this.updateConfig = updateConfig || (() => {});
  }
  // HELPER FUNCTION DO NOT USE BUT IF YOU WANT YOU CAN USE IT
  public static getInstance(
    baseUrl: string,
    getAuthToken?: () => string | undefined,
    setAuthToken?: (
      accessToken: string | null,
      refreshToken: string | null,
      autoUpdateConfig?: boolean
    ) => void,
    updateConfig?: (config: Config) => void,
    getRefreshToken?: () => string | undefined
  ): DuftHttpClient {
    if (!this.instance) {
      this.instance = new DuftHttpClient(
        baseUrl,
        getAuthToken,
        setAuthToken,
        updateConfig,
        getRefreshToken
      );
    }
    return this.instance;
  }

  private async refreshToken(): Promise<void> {
    if (this.refreshTokenPromise) {
      await this.refreshTokenPromise; // Wait for the ongoing refresh operation
      return;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        console.log("Refreshing token with refresh token:", refreshToken);

        const response = await this.makeRequest(
          "POST",
          `${this.baseUrl}/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const { access, refresh } = response;

        if (access) {
          console.log("New access token received:", access);
          this.setAuthToken(access, refresh, false);
        } else {
          throw new Error("Failed to get access token");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        this.setAuthToken(null, null); // Clear tokens on refresh failure
        throw error;
      } finally {
        this.refreshTokenPromise = null; // Clear the promise
      }
    })();

    await this.refreshTokenPromise;
  }

  private async makeRequest(
    method: string,
    endpoint: string,
    body?: Record<string, any>,
    forceAuth?: boolean
  ): Promise<any> {
    const isPublicRoute = this.publicRoutes.some((route) =>
      endpoint.startsWith(`${this.baseUrl}${route}`)
    );
    const useAuth = forceAuth || !isPublicRoute;
    let token = useAuth ? this.getAuthToken() : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(
      `Making request to ${endpoint} with method ${method} and headers`,
      headers
    );

    const response = await fetch(endpoint, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);

      if (response.status === 401 && useAuth) {
        // Prevent recursion for /token/refresh requests
        if (!endpoint.includes("/token/refresh/")) {
          try {
            console.log("Token expired, attempting to refresh token...");
            await this.refreshToken();
            token = this.getAuthToken();
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
              console.log("Retrying request with new token:", token);
              return this.makeRequest(method, endpoint, body, forceAuth); // Retry with refreshed token
            }
          } catch (error) {
            console.error(
              "Unauthorized error after token refresh attempt:",
              error
            );
            throw new UnauthorizedError(errorPayload);
          }
        }
      }

      switch (response.status) {
        case 400:
          throw new BadRequestError(errorPayload);
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

    return await response.json();
  }

  async getCurrentConfig(useAuthentication: boolean = true): Promise<Config> {
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
    console.log("Logging in with username:", username);
    const response = await this.makeRequest("POST", `${this.baseUrl}/token/`, {
      username,
      password,
    });

    if (response.access && response.refresh) {
      console.log(
        "Login successful, setting tokens:",
        response.access,
        response.refresh
      );
      this.setAuthToken(response.access, response.refresh);
    } else {
      console.log("Login failed, no tokens received");
    }

    return response;
  }

  async logout() {
    this.setAuthToken(null, null);
  }

  async getDataConnections(): Promise<any> {
    return this.makeRequest("GET", `${this.baseUrl}/data-connections`);
  }

  async getConnectionParameters(connectionId: string): Promise<any> {
    return this.makeRequest(
      "GET",
      `${this.baseUrl}/data-connections/${connectionId}/parameters`
    );
  }

  async updateConnectionParameters(
    connectionId: string,
    parameters: Record<string, any>
  ): Promise<any> {
    return this.makeRequest(
      "POST",
      `${this.baseUrl}/data-connections/${connectionId}/parameters`,
      parameters
    );
  }

  async getLogFile(): Promise<{ content: string[] }> {
    return this.makeRequest("GET", `${this.baseUrl}/log`);
  }
}
