import { describe, it, expect, beforeEach } from "vitest";
import { DuftHttpClient } from "./DuftHttpClient";
import { UnauthorizedError } from "./ErrorClasses";

describe("DuftHttpClient - getCurrentConfig", () => {
  const BASE_URL = "http://127.0.0.1:8000/api/v2";
  const client = new DuftHttpClient(BASE_URL);

  it("should fetch the current config successfully", async () => {
    try {
      const response = await client.getCurrentConfig();

      // General structure
      expect(response).toBeDefined();
      expect(response).toHaveProperty("settings");

      // Features structure and values
      expect(Array.isArray(response.features)).toBe(true);
      expect(Object.keys(response.features)).toBeGreaterThan(0);
    } catch (error) {
      console.error("Error fetching current config:", error);
      throw error;
    }
  });
});

describe("DuftHttpClient - Real Authentication and getCurrentConfig", () => {
  const BASE_URL = "http://127.0.0.1:8000/api/v2";

  // In-memory token storage for the test
  let tokenStore: string | null;

  const getTokenFromStore = (): string | null => {
    return tokenStore;
  };

  const setTokenInStore = (token: string): void => {
    tokenStore = token;
  };

  const client = new DuftHttpClient(
    BASE_URL,
    getTokenFromStore,
    setTokenInStore
  );

  beforeEach(() => {
    tokenStore = null; // Reset token store before each test
  });

  it("should fetch user, roles, and permissions after successful authentication", async () => {
    // Replace with valid test credentials
    const username = "admin";
    const password = "--------";

    // Authenticate and store token
    const loginResponse = await client.login(username, password);

    expect(loginResponse).toHaveProperty("access");
    expect(loginResponse.access).toBeDefined();
    expect(typeof loginResponse.access).toBe("string");

    // Ensure the token is stored in the in-memory store
    expect(tokenStore).toBe(loginResponse.access);

    // Fetch configuration
    const configResponse = await client.getCurrentConfig();

    expect(configResponse).toHaveProperty("currentUser");
    expect(configResponse).toHaveProperty("currentUserRoles");

    expect(configResponse.currentUser).not.toBeNull();
    expect(configResponse.currentUserPermissions.length).toBeGreaterThan(0);
    expect(configResponse.currentUserRoles.length).toBeGreaterThan(0);
  });
});

describe("DuftHttpClient - login", () => {
  const BASE_URL = "http://127.0.0.1:8000/api/v2";
  const client = new DuftHttpClient(BASE_URL);

  it("should login successfully and return a token", async () => {
    const username = "data_manager"; // Replace with valid test credentials
    const password = "--------"; // Replace with valid test credentials

    try {
      const response = await client.login(username, password);

      // General structure
      expect(response).toBeDefined();
      expect(response).toHaveProperty("access");
      expect(typeof response.access).toBe("string");
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  });

  it("should throw UnauthorizedError for invalid credentials", async () => {
    const invalidUsername = "invalid_user"; // Invalid username
    const invalidPassword = "wrong_password"; // Invalid password

    try {
      await client.login(invalidUsername, invalidPassword);
      // If no error is thrown, fail the test
      throw new Error("Expected UnauthorizedError but no error was thrown");
    } catch (error) {
      // Validate that the error is an instance of UnauthorizedError
      expect(error).toBeInstanceOf(UnauthorizedError);

      // Optionally check for a specific error message or payload
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBeDefined();
        expect(error.message).toContain("Unauthorized"); // Adjust based on your API's error response
      }
    }
  });
});

describe("DuftHttpClient - Protected Routes", () => {
  const BASE_URL = "http://127.0.0.1:8000/api/v2";

  // In-memory token storage for the test
  let tokenStore: string | null;

  const getTokenFromStore = (): string | null => {
    return tokenStore;
  };

  const setTokenInStore = (token: string): void => {
    tokenStore = token;
  };

  const client = new DuftHttpClient(
    BASE_URL,
    getTokenFromStore,
    setTokenInStore
  );

  beforeEach(() => {
    tokenStore = null; // Reset token store before each test
  });

  it("should fetch navigation file after authenticating", async () => {
    const username = "data_manager"; // Replace with valid credentials
    const password = "--------"; // Replace with valid credentials

    try {
      // Step 1: Authenticate and retrieve the token
      const loginResponse = await client.login(username, password);
      expect(loginResponse).toHaveProperty("access");

      const token = loginResponse.access;
      expect(typeof token).toBe("string");

      // Step 3: Access the protected route
      const navigationResponse = await client.getNavigationFile();

      // Step 4: Assert the returned data structure
      expect(navigationResponse).toBeDefined();
    } catch (error) {
      console.error("Error fetching protected route data:", error);
      throw error;
    }
  });
});

describe("DuftHttpClient - Token Refresh", () => {
  const BASE_URL = "http://127.0.0.1:8000/api/v2";
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  const getAccessToken = () => accessToken;
  const getRefreshToken = () => refreshToken;
  const setTokens = (
    newAccessToken: string | null,
    newRefreshToken: string | null
  ) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
  };

  const client = new DuftHttpClient(
    BASE_URL,
    getAccessToken,
    setTokens,
    undefined,
    getRefreshToken
  );

  beforeEach(() => {
    accessToken = null;
    refreshToken = null;
  });

  it("should refresh token when access token expires", async () => {
    // First login to get initial tokens
    const username = "data_manager"; // Replace with valid test credentials
    const password = "--------"; // Replace with valid test credentials

    const loginResponse = await client.login(username, password);
    expect(loginResponse).toHaveProperty("access");
    expect(loginResponse).toHaveProperty("refresh");

    // Store the initial tokens for comparison
    const initialAccessToken = accessToken;

    // Wait for access token to expire (adjust time based on your token expiry setting)
    // For testing, you might want to set a short expiry time in your dev environment
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds

    // Make a request that should trigger token refresh
    await client.getCurrentConfig();

    // Verify we got a new access token
    expect(accessToken).toBeDefined();
    expect(accessToken).not.toBe(initialAccessToken);

    // Verify the new token works by making another request
    const secondResponse = await client.getCurrentConfig();
    expect(secondResponse).toBeDefined();
  }, 10000); // Increase timeout to account for waiting period
});
