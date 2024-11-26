import type { Config } from "../../context/types";
import DispatchService from "../../services/dispatchService";
import { DuftHttpClient } from "./DuftHttpClient";

const client = new DuftHttpClient(
  "http://127.0.0.1:8000/api/v2",
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient
);

/**
 * Retrieves the token from localStorage.
 * @returns {string | undefined} The token if it exists, otherwise undefined.
 */
export function getTokenFromLocalStorage(): string | undefined {
  const token = localStorage.getItem("accessToken");
  return token || undefined; // Return undefined if the token is null
}

export function getRefreshToken(): string | undefined {
  const token = localStorage.getItem("refreshToken");
  return token || undefined;
}

/**
 * Stores the token in localStorage.
 * @param {string} token - The token to store.
 */
export function setTokenInLocalStorage(
  accessToken: string | null,
  refreshToken: string | null,
  autoUpdateConfig: boolean = true
): void {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    localStorage.removeItem("accessToken");
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }
  
  // Only update config if autoUpdateConfig is true
  if (autoUpdateConfig) {
    client.getCurrentConfig();
  }
  console.log("donnneee!");
}

export function updateConfigFromHttpClient(config: Config): void {
  try {
    console.log(config);
    const dispatch = DispatchService.getDispatch();
    dispatch({ type: "SET_CONFIG", payload: config });
  } catch (error) {
    console.warn("Dispatch not available:", error);
  }
}

export function clearTokensFromLocalStorage(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
