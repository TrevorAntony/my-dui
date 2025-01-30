import { renderHook } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// App Components
import {
  AppStateProvider,
  useAppState,
} from "../../../context/AppStateContext";
import AppInitializer from "../../../ui-components/app-initializer";
import { GlobalState } from "../../../context/types";

// HTTP Client and utilities
import { DuftHttpClient } from "../../../api/DuftHttpClient/DuftHttpClient";
import {
  updateConfigFromHttpClient,
  clearTokensFromLocalStorage,
} from "../../../api/DuftHttpClient/local-storage-functions";
import { makeAuthenticatedRequest, mockConfig } from "./test-helpers";

const BASE_URL = "http://127.0.0.1:8000/api/v2";

// Add QueryClient creation utility
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Test utilities

const waitForState = <T extends unknown>(
  condition: (state: T) => boolean,
  result: { current: { state: T } }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (condition(result.current.state)) {
        clearInterval(interval);
        resolve();
      }
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      reject(new Error("Timeout waiting for state change"));
    }, 5000); // Increased timeout to 5 seconds
  });
};

describe("AppInitializer State Transitions", () => {
  const stateTransitions: { state: GlobalState; config: any }[] = [];
  let authToken: string | undefined;
  let refreshToken: string | undefined;

  const getAuthToken = () => authToken;
  const getRefreshToken = () => refreshToken;
  const setAuthToken = async (
    access: string | null,
    refresh: string | null,
    autoUpdateConfig: boolean = true
  ) => {
    authToken = access ?? undefined;
    refreshToken = refresh ?? undefined;
    if (autoUpdateConfig) {
      const config = await makeAuthenticatedRequest(
        `${BASE_URL}/get-current-config`,
        authToken
      );
      updateConfigFromHttpClient(config);
    }
  };

  beforeEach(() => {
    clearTokensFromLocalStorage();
    stateTransitions.length = 0;
    authToken = undefined;
    refreshToken = undefined;
  });

  test("follows correct state transition path when not authenticated", async () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: ({ children }) => (
        <AppStateProvider>
          <AppInitializer />
          {children}
        </AppStateProvider>
      ),
    });

    // Track initial render state
    expect(result.current.state.state).toBe(GlobalState.SPLASH);
    expect(result.current.state.config).toBeNull();

    stateTransitions.push({
      state: result.current.state.state,
      config: result.current.state.config,
    });

    // Wait for state transitions with corrected condition
    await waitForState(
      (state) => state?.state === GlobalState.AUTH_REQUIRED,
      result
    );

    // Track final state
    stateTransitions.push({
      state: result.current.state.state,
      config: result.current.state.config,
    });

    // Verify state transition path
    expect(stateTransitions).toEqual([
      { state: GlobalState.SPLASH, config: null },
      { state: GlobalState.AUTH_REQUIRED, config: expect.any(Object) },
    ]);

    // Verify final state details
    expect(result.current.state.config?.features.user_authentication).toBe(
      true
    );
    expect(result.current.state.config?.currentUser).toBeNull();
  });

  test("follows correct state transition path after authentication", async () => {
    const testQueryClient = createTestQueryClient();
    const testClient = new DuftHttpClient(
      BASE_URL,
      getAuthToken,
      setAuthToken,
      updateConfigFromHttpClient,
      getRefreshToken
    );

    const { result } = renderHook(() => useAppState(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
          <AppStateProvider>
            <AppInitializer />
            {children}
          </AppStateProvider>
        </QueryClientProvider>
      ),
    });

    // Track initial render state
    expect(result.current.state.state).toBe(GlobalState.SPLASH);
    expect(result.current.state.config).toBeNull();

    stateTransitions.push({
      state: result.current.state.state,
      config: result.current.state.config,
    });

    // Wait for transition to AUTH_REQUIRED
    await waitForState(
      (state) => state?.state === GlobalState.AUTH_REQUIRED,
      result
    );

    stateTransitions.push({
      state: result.current.state.state,
      config: result.current.state.config,
    });

    // Perform authentication
    await testClient.login("admin", "--------");
    expect(authToken).toBeDefined();

    // Wait for transition to APP_READY
    await waitForState(
      (state) => state?.state === GlobalState.APP_READY,
      result
    );

    // Track final state
    stateTransitions.push({
      state: result.current.state.state,
      config: result.current.state.config,
    });

    // Verify complete state transition path
    expect(stateTransitions).toEqual([
      { state: GlobalState.SPLASH, config: null },
      { state: GlobalState.AUTH_REQUIRED, config: expect.any(Object) },
      { state: GlobalState.APP_READY, config: expect.any(Object) },
    ]);

    // Verify final state details
    expect(result.current.state.config?.features.user_authentication).toBe(
      true
    );
    expect(result.current.state.config?.currentUser).toBeDefined();
  });

  test("follows correct state transition path with auth disabled", async () => {
    // Create client instance with mocked makeRequest
    const testClient = new DuftHttpClient(
      BASE_URL,
      getAuthToken,
      setAuthToken,
      updateConfigFromHttpClient,
      getRefreshToken
    );

    // Spy on the private makeRequest method
    const makeRequestSpy = vi
      .spyOn(testClient as any, "makeRequest")
      .mockImplementation(async (method: string, endpoint: string) => {
        if (endpoint.includes("/get-current-config")) {
          return mockConfig;
        }
        return {};
      });

    const { result } = renderHook(() => useAppState(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={createTestQueryClient()}>
          <AppStateProvider>
            <AppInitializer customHttpClient={testClient} />
            {children}
          </AppStateProvider>
        </QueryClientProvider>
      ),
    });

    // Track initial render state
    expect(result.current.state.state).toBe(GlobalState.SPLASH);
    expect(result.current.state.config).toBeNull();

    stateTransitions.push({
      state: result.current.state.state,
      config: result.current.state.config,
    });

    // Wait for direct transition to APP_READY due to auth being disabled
    await waitForState(
      (state) => state?.state === GlobalState.APP_READY,
      result
    );

    // Track final state
    stateTransitions.push({
      state: result.current.state.state,
      config: result.current.state.config,
    });

    // Verify state transition path
    expect(stateTransitions).toEqual([
      { state: GlobalState.SPLASH, config: null },
      { state: GlobalState.APP_READY, config: expect.any(Object) },
    ]);

    // Verify final state details
    expect(result.current.state.config?.features.user_authentication).toBe(
      false
    );

    // Clean up
    makeRequestSpy.mockRestore();
  });
});
