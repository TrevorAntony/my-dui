import { describe, it, expect, beforeEach } from "vitest";
import { DuftHttpClient } from "./DuftHttpClient";

describe("DuftHttpClient Integration Tests", () => {
  let authToken: string | undefined;
  let refreshToken: string | undefined;
  const baseUrl = "http://127.0.0.1:8000/api/v2";

  const getAuthToken = () => authToken;
  const getRefreshToken = () => refreshToken;
  const setAuthToken = (access: string | null, refresh: string | null) => {
    authToken = access ?? undefined;
    refreshToken = refresh ?? undefined;
    console.log("Tokens updated:", { authToken, refresh });
  };

  const updateConfig = () => {};

  let client: DuftHttpClient;

  beforeEach(() => {
    authToken = undefined;
    refreshToken = undefined;

    client = DuftHttpClient.getInstance(
      baseUrl,
      getAuthToken,
      setAuthToken,
      updateConfig,
      getRefreshToken
    );
  });

  it("should reach the API and get current config without authentication", async () => {
    const config = await client.getCurrentConfig(false);

    expect(config).toBeDefined();
    expect(config.features).toBeDefined();
    expect(config.settings).toBeDefined();
  });

  it("should authenticate and refresh token", async () => {
    console.log("LETS GO");
    // Initial login
    const loginResult = await client.login("admin", "--------");
    console.log("Login response:", loginResult);

    const initialAuthToken = authToken;
    console.log("Initial auth token:", initialAuthToken);

    // First navigation call with initial token
    const nav1 = await client.getNavigationFile();
    console.log("First navigation response:", nav1);
    expect(nav1).toBeDefined();

    // Wait for token to expire (11 seconds)
    console.log("Waiting for token expiration...");
    await new Promise((resolve) => setTimeout(resolve, 11000));

    // Second navigation call should trigger token refresh
    const nav2 = await client.getNavigationFile();
    console.log("Second navigation response:", nav2);
    expect(nav2).toBeDefined();

    // Verify token was refreshed
    console.log("Final auth token:", authToken);
    expect(authToken).toBeDefined();
    expect(authToken).not.toBe(initialAuthToken);
  }, 20000);
});
