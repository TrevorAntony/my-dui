import { describe, it, expect, beforeEach, vi } from "vitest";
import { DuftHttpClient } from "../../core/api/DuftHttpClient/DuftHttpClient";
import { UnauthorizedError, BadRequestError } from "../../core/api/DuftHttpClient/ErrorClasses";
import { mockConfig } from "../../utils/test-utilities/test-helpers";
import { GlobalState } from "../../core/context/types";

const BASE_URL = "http://127.0.0.1:8000/api/v2";
let accessToken: string | null = null;
let refreshToken: string | null = null;

const getAccessToken = () => accessToken;
const getRefreshToken = () => refreshToken;
const setTokens = (newAccessToken: string | null, newRefreshToken: string | null) => {
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

describe("OOBE Integration Tests", () => {
  let testClient: DuftHttpClient;
  let currentState = GlobalState.SPLASH;

  const mockDispatch = vi.fn((action) => {
    if (action.type === "SET_STATE") {
      currentState = action.payload;
    }
  });

  // Mock useAppState
  vi.mock("../core/context/AppStateContext", () => ({
    useAppState: () => ({
      state: { state: currentState },
      dispatch: mockDispatch
    })
  }));

  beforeEach(async () => {
    // Reset state before each test
    currentState = GlobalState.SPLASH;
    mockDispatch.mockClear();

    vi.clearAllMocks();
    const makeRequestSpy = vi.spyOn(DuftHttpClient.prototype as any, "makeRequest");
    
    // Mock successful login
    makeRequestSpy.mockImplementationOnce(() => ({
      access: "test-token",
      refresh: "test-refresh"
    }));

    let currentSettings = {
      debug: true,
      oobe: false,
      unittest: false
    };

    // Mock API responses
    makeRequestSpy.mockImplementation(async (method: string, endpoint: string, body?: any) => {
      if (endpoint.includes('/settings')) {
        if (method === 'GET') {
          return currentSettings;
        }
        if (method === 'POST') {
          if (!body?.data || typeof body.data.oobe !== 'boolean') {
            throw new BadRequestError({
              message: "Invalid settings payload"
            });
          }
          currentSettings = { ...currentSettings, ...body.data };
          return {
            result: "success",
            message: "Settings updated successfully.",
            data: { data: body.data },
            status: 200
          };
        }
      }

      if (endpoint.includes('/data-connections')) {
        if (endpoint.includes('/parameters')) {
          if (method === 'POST') {
            if (!body?.data?.host || body.data.port < 0) {
              throw new BadRequestError({
                message: "Invalid connection parameters"
              });
            }
            return {
              result: "success",
              message: "Data connection parameters updated successfully.",
              data: { data: body.data },
              status: 200
            };
          }
        }
        return { system: [], user: [] };
      }

      if (endpoint.includes('/get-current-config')) {
        return mockConfig;
      }

      return {};
    });

    testClient = new DuftHttpClient(BASE_URL, getAccessToken, setTokens, undefined, getRefreshToken);
    await testClient.login("admin", "--------");
  });

  describe("State Transition Flow", () => {
    it("should start in SPLASH state", () => {
      expect(currentState).toBe(GlobalState.SPLASH);
    });

    it("should transition to APP_READY when config is loaded", async () => {
      const config = await testClient.getCurrentConfig();
      expect(config.features.user_authentication).toBeDefined();
      
      // Simulate config loading completion
      mockDispatch({ type: "SET_STATE", payload: GlobalState.APP_READY });
      expect(currentState).toBe(GlobalState.APP_READY);
    });

    it("should transition to APP_SETUP when OOBE is false", async () => {
      // Get initial settings
      const settings = await testClient.getSettings();
      expect(settings.oobe).toBe(false);
      
      // Check state transition
      const nextState = settings.oobe ? GlobalState.APP_MAIN : GlobalState.APP_SETUP;
      mockDispatch({ type: "SET_STATE", payload: nextState });
      expect(currentState).toBe(GlobalState.APP_SETUP);
    });

    it("should transition to APP_MAIN after successful OOBE completion", async () => {
      // Initial state check
      const initialSettings = await testClient.getSettings();
      expect(initialSettings.oobe).toBe(false);

      // Update connection parameters
      await testClient.updateConnectionParameters("DUFT-SERVER-API", {
        data: {
          host: "localhost",
          port: 8000
        }
      });

      // Complete OOBE
      const settingsResponse = await testClient.updateSettings({
        data: {
          debug: true,
          oobe: true,
          unittest: false
        }
      });
      expect(settingsResponse.result).toBe("success");

      // Verify state changes
      const finalSettings = await testClient.getSettings();
      expect(finalSettings.oobe).toBe(true);
      
      const nextState = finalSettings.oobe ? GlobalState.APP_MAIN : GlobalState.APP_SETUP;
      mockDispatch({ type: "SET_STATE", payload: nextState });
      expect(currentState).toBe(GlobalState.APP_MAIN);
    });

    it("should maintain APP_MAIN state after OOBE completion", async () => {
      // Set OOBE as complete
      await testClient.updateSettings({
        data: { oobe: true }
      });

      // Verify state persists after refresh
      const settings = await testClient.getSettings();
      expect(settings.oobe).toBe(true);
      
      const state = settings.oobe ? GlobalState.APP_MAIN : GlobalState.APP_SETUP;
      mockDispatch({ type: "SET_STATE", payload: state });
      expect(currentState).toBe(GlobalState.APP_MAIN);
    });

    it("should handle state transitions with invalid settings", async () => {
      // Test with missing settings
      await expect(testClient.updateSettings({
        data: {}
      })).rejects.toThrow();

      // Verify state remains unchanged
      const settings = await testClient.getSettings();
      expect(settings.oobe).toBeDefined();
    });
  });

  it("should handle initial settings check", async () => {
    const settings = await testClient.getSettings();
    expect(settings).toBeDefined();
    expect(settings).toHaveProperty("debug");
    expect(settings).toHaveProperty("unittest");
    expect(settings).toHaveProperty("oobe");
    expect(typeof settings.oobe).toBe("boolean");
  });

  it("should fetch current configuration", async () => {
    const config = await testClient.getCurrentConfig();
    expect(config).toBeDefined();
    expect(config).toHaveProperty("version");
    expect(config).toEqual(mockConfig);
  });

  it("should fetch data connections", async () => {
    const connections = await client.getDataConnections();
    expect(connections).toBeDefined();
    expect(connections).toHaveProperty("system");
    expect(connections).toHaveProperty("user");
  });

  it("should complete OOBE setup flow", async () => {
    // Get initial settings
    const settings = await testClient.getSettings();
    expect(settings.oobe).toBe(false);

    // Update DUFT server connection
    const connResponse = await testClient.updateConnectionParameters("DUFT-SERVER-API", {
      data: {
        host: "localhost",
        port: 8000
      }
    });
    expect(connResponse.result).toBe("success");

    // Mark OOBE as complete
    const settingsResponse = await testClient.updateSettings({
      data: {
        debug: true,
        oobe: true,
        unittest: false
      }
    });
    
    expect(settingsResponse.result).toBe("success");
    expect(settingsResponse.status).toBe(200);
  });

  it("should handle connection parameter updates", async () => {
    const response = await testClient.updateConnectionParameters("DUFT-SERVER-API", {
      data: {
        host: "localhost",
        port: 8000
      }
    });
    
    expect(response.result).toBe("success");
    expect(response.status).toBe(200);
  });

  it("should handle authentication errors", async () => {
    const makeRequestSpy = vi.spyOn(testClient as any, "makeRequest");
    makeRequestSpy.mockRejectedValueOnce(new UnauthorizedError("Unauthorized"));

    accessToken = null;
    refreshToken = null;
    
    await expect(testClient.getSettings()).rejects.toThrow(UnauthorizedError);
  });

  it("should handle server errors gracefully", async () => {
    await expect(testClient.updateSettings({
      data: {
        invalid_key: true,
        debug: undefined,
        oobe: null
      }
    })).rejects.toThrow("Invalid settings payload");
  });

  it("should validate connection parameters", async () => {
    await expect(testClient.updateConnectionParameters("DUFT-SERVER-API", {
      data: {
        host: "",
        port: -1
      }
    })).rejects.toThrow("Invalid connection parameters");
  });

  it("should follow OOBE flow correctly", async () => {
    const settings = await testClient.getSettings();
    expect(settings.oobe).toBe(false);

    const connResponse = await testClient.updateConnectionParameters("DUFT-SERVER-API", {
      data: {
        host: "localhost",
        port: 8000
      }
    });
    expect(connResponse.result).toBe("success");

    const response = await testClient.updateSettings({
      data: {
        debug: true,
        oobe: true,
        unittest: false
      }
    });
    expect(response.result).toBe("success");

    const finalSettings = await testClient.getSettings();
    expect(finalSettings.oobe).toBe(true);
  });
});
