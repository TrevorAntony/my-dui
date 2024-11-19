import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { DuftHttpClient } from "./DuftHttpClient";

const BASE_URL = "http://127.0.0.1:8000/api/v2";

it("should fetch the current config from the API", async () => {
  const client = new DuftHttpClient(BASE_URL);
  const config = await client.getCurrentConfig();

  expect(config).toBeDefined();
  expect(config).toHaveProperty("features");

  const features = config.features;
  expect(Array.isArray(features)).toBe(true);

  // Find the feature flag for user authentication and assert its value
  const userAuthFeature = features.find(
    (feature: { user_authentication?: boolean }) =>
      "user_authentication" in feature
  );
  expect(userAuthFeature?.user_authentication).toBe(false);

  // Assert other properties in the response
  expect(config).toHaveProperty("currentUser", null);
  expect(config).toHaveProperty("currentUserPermissions");
  expect(config.currentUserPermissions).toEqual([]);
  expect(config).toHaveProperty("currentUserRoles");
  expect(config.currentUserRoles).toEqual([]);

  // Check settings
  expect(config).toHaveProperty("settings");
  expect(config.settings).toHaveProperty("appName", "DUFT (configurable)");
  expect(config.settings).toHaveProperty("footer", "Configurable footer text");
  expect(config.settings).toHaveProperty("custom", "Custom setting");
});

describe("DuftHttpClient Integration Tests", () => {
  const baseUrl = BASE_URL;
  const httpClient = new DuftHttpClient(baseUrl);

  beforeAll(() => {
    localStorage.setItem(
      "accessToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMxODc0NDAzLCJpYXQiOjE3MzE4NzQxMDMsImp0aSI6ImJjZjc1MTM5YzdkYTQ3ZWZiZDllZTlhNjY3YTgzN2EwIiwidXNlcl9pZCI6MX0.mZ6l8oWBYFENd_sYqjt74FGIZyt5-2mqR_9a5G_fzNs"
    );
    localStorage.setItem(
      "refreshToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMTk2MDUwMywiaWF0IjoxNzMxODc0MTAzLCJqdGkiOiJkYWZiMDRiNGU3MjY0NmMyYmE3MDA4ZGRhMDM1NjgwYiIsInVzZXJfaWQiOjF9.mO6_1S26Fe0MryJzMV7-StWDaAWzb9oYIyN7lNibE_Q"
    );
  });

  afterAll(() => {
    // Clear tokens from localStorage after tests
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  });

  it("should successfully run a data task", async () => {
    const taskPayload = {
      data_task_id: "SAMPLE-NOTEBOOK",
    };

    const result = await httpClient.runDataTask(taskPayload);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("message");
    expect(result.message).toBe("Script started successfully.");
  });
});
