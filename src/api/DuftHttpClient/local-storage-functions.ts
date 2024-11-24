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

/**
 * Stores the token in localStorage.
 * @param {string} token - The token to store.
 */
export function setTokenInLocalStorage(token: string): void {
  localStorage.setItem("accessToken", token);
  client.getCurrentConfig();
}

export function updateConfigFromHttpClient(config: Config): void {
  try {
    const dispatch = DispatchService.getDispatch();
    dispatch({ type: "SET_CONFIG", payload: config });
  } catch (error) {
    console.warn("Dispatch not available:", error);
  }
}
