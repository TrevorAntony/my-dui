export class DuftHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Fetch current configuration from the API
  async getCurrentConfig(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/get-current-config`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching config: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch current config:", error);
      throw error;
    }
  }

  // Fetch navigation file (protected route)
  async getNavigationFile(): Promise<any> {
    return this.makeRequestWithAuth("GET", `${this.baseUrl}/navigation`);
  }

  // Fetch dashboard file (protected route)
  async getDashboardFile(myFile: string): Promise<any> {
    return this.makeRequestWithAuth(
      "GET",
      `${this.baseUrl}/3dldashboard/${myFile}`
    );
  }

  // Fetch theme file (protected route)
  async getTheme(): Promise<any> {
    return this.makeRequestWithAuth("GET", `${this.baseUrl}/theme`);
  }

  // Run query with a payload (protected route)
  async getQueryData(requestPayload: Record<string, any>): Promise<any> {
    return this.makeRequestWithAuth(
      "POST",
      `${this.baseUrl}/run-query`,
      requestPayload
    );
  }

  async runDataTask(taskPayload: Record<string, any>): Promise<any> {
    return this.makeRequestWithAuth(
      "POST",
      `${this.baseUrl}/run-data-task`,
      taskPayload
    );
  }

  // Private helper method to centralize authenticated requests
  private async makeRequestWithAuth(
    method: string,
    endpoint: string,
    body?: Record<string, any>
  ): Promise<any> {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const authenticationEnabled = !!accessToken || !!refreshToken;

      let response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(authenticationEnabled && {
            Authorization: `Bearer ${accessToken}`,
          }),
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      // Handle token expiration (401) and attempt to refresh
      if (response.status === 401 && refreshToken) {
        console.log("Access token expired, attempting to refresh...");

        const refreshResponse = await fetch(
          `http://127.0.0.1:8000/api/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
          }
        );

        if (refreshResponse.ok) {
          const { access: newAccessToken } = await refreshResponse.json();
          localStorage.setItem("accessToken", newAccessToken);

          console.log("Access token refreshed successfully");

          // Retry the original request with the new access token
          accessToken = newAccessToken;
          response = await fetch(endpoint, {
            method,
            headers: {
              "Content-Type": "application/json",
              ...(authenticationEnabled && {
                Authorization: `Bearer ${accessToken}`,
              }),
            },
            ...(body && { body: JSON.stringify(body) }),
          });
        } else {
          // If refresh token is invalid, clear storage and redirect to login
          console.error("Failed to refresh token, redirecting to login...");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return;
        }
      } else if (response.status === 401 && !refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch data", error);
      throw error;
    }
  }
}
