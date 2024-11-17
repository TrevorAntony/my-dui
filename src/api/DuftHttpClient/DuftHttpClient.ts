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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch current config:", error);
      throw error;
    }
  }

  // Fetch navigation file (protected route)
  async getNavigationFile(): Promise<any> {
    return this.fetchWithAuth(`${this.baseUrl}/navigation`);
  }

  // Fetch dashboard file (protected route)
  async getDashboardFile(myFile: string): Promise<any> {
    return this.fetchWithAuth(`${this.baseUrl}/3dldashboard/${myFile}`);
  }

  // Fetch theme file (protected route)
  async getTheme(): Promise<any> {
    return this.fetchWithAuth(`${this.baseUrl}/theme`);
  }

  // Run query with a payload (protected route)
  async getQueryData(requestPayload: Record<string, any>): Promise<any> {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const authenticationEnabled = !!accessToken || !!refreshToken;

      let response = await fetch(`${this.baseUrl}/run-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authenticationEnabled && {
            Authorization: `Bearer ${accessToken}`,
          }),
        },
        body: JSON.stringify(requestPayload),
      });

      // Handle token expiration (401) and attempt to refresh
      if (response.status === 401 && refreshToken) {
        console.log("Access token expired, attempting to refresh...");

        const refreshResponse = await fetch(
          `http://localhost:8000/api/token/refresh/`,
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
          response = await fetch(`${this.baseUrl}/run-query`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authenticationEnabled && {
                Authorization: `Bearer ${accessToken}`,
              }),
            },
            body: JSON.stringify(requestPayload),
          });
        } else {
          // If refresh token is invalid, clear storage and redirect to login
          console.error("Failed to refresh token, redirecting to login...");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return;
        }
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch query data", error);
      throw error;
    }
  }

  // Private helper method to handle token-based authentication
  private async fetchWithAuth(endpoint: string): Promise<any> {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const authenticationEnabled = !!accessToken || !!refreshToken;

      let response = await fetch(endpoint, {
        headers: {
          ...(authenticationEnabled && {
            Authorization: `Bearer ${accessToken}`,
          }),
        },
      });

      // Handle token expiration (401) and attempt to refresh
      if (response.status === 401 && refreshToken) {
        console.log("Access token expired, attempting to refresh...");

        const refreshResponse = await fetch(
          `http://localhost:8000/api/token/refresh/`,
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
            headers: {
              ...(authenticationEnabled && {
                Authorization: `Bearer ${accessToken}`,
              }),
            },
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
