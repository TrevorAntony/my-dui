// src/api/api.ts
import config from "../config";

export const fetchDataAndStore = async (
  endpoint: string,
  setData: (data: unknown) => void
): Promise<void> => {
  try {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`);
    const result = await response.json();
    setData(result);
  } catch (error) {
    console.error("Failed to fetch and store data", error);
  }
};

//this function should eventually be deprecated in favor of the http client methods
export const fetchDataWithoutStore = async (
  endpoint: string,
  authenticationEnabled?: boolean
): Promise<unknown> => {
  try {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const addAuthenticationHeader = !!accessToken || !!authenticationEnabled;

    let response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      headers: {
        ...(addAuthenticationHeader && {
          Authorization: `Bearer ${accessToken}`,
        }),
      },
    });

    // If the access token is expired (401), try to refresh it
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
        response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
          headers: {
            ...(addAuthenticationHeader && {
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
      }
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data", error);
    throw error;
  }
};
