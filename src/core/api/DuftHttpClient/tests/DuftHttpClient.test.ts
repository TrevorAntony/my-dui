import { describe, it, expect, beforeEach } from "vitest";
import { DuftHttpClient } from "../DuftHttpClient";

describe("DuftHttpClient - getCurrentConfig", () => {
  const BASE_URL = "http://127.0.0.1:8000/api/v2";
  const client = new DuftHttpClient(BASE_URL);

  it("should fetch the current config successfully", async () => {
    try {
      const response = await client.getCurrentConfig();

      // General structure
      expect(response).toBeDefined();
      expect(response).toHaveProperty("settings");
      expect(response).toHaveProperty("features");
      expect(response).toHaveProperty("version");
      expect(response).toHaveProperty("pythonPath");
      expect(response).toHaveProperty("pythonVersion");
      expect(response).toHaveProperty("serverBaseURL");
      expect(response).toHaveProperty("directories");
      expect(response).toHaveProperty("currentUser");
      expect(response).toHaveProperty("currentUserPermissions");
      expect(response).toHaveProperty("currentUserRoles");

      // Features structure validation
      expect(typeof response.features.data_tasks).toBe("boolean");
      expect(typeof response.features.enforce_user_authentication).toBe(
        "boolean"
      );
      expect(typeof response.features.log_level).toBe("string");
      expect(typeof response.features.server_uploads).toBe("boolean");
      expect(typeof response.features.task_scheduler).toBe("boolean");
      expect(typeof response.features.user_authentication).toBe("boolean");

      // Settings validation
      expect(response.settings.appName).toBe("DUFT (configurable)");
      expect(response.settings.footer).toBe("Configurable footer text");
      expect(response.settings.version).toBe("1.0.0");
      expect(response.settings.credits).toBeDefined();
      expect(Array.isArray(response.settings.credits.productOwners)).toBe(true);
      expect(Array.isArray(response.settings.credits.developers)).toBe(true);

      // User data validation (can be null/empty)
      expect(Array.isArray(response.currentUserPermissions)).toBe(true);
      expect(Array.isArray(response.currentUserRoles)).toBe(true);
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
    expect(configResponse).toHaveProperty("currentUserPermissions");

    // These properties might be null/empty if not authenticated
    expect(Array.isArray(configResponse.currentUserPermissions)).toBe(true);
    expect(Array.isArray(configResponse.currentUserRoles)).toBe(true);
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
      throw new Error("Expected error but no error was thrown");
    } catch (error: any) {
      expect(error.status).toBe(401);
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
