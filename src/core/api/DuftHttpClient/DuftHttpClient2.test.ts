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
});
