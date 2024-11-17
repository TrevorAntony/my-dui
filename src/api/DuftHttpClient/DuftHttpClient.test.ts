import { expect, test } from "vitest";
import { DuftHttpClient } from "./DuftHttpClient";

const BASE_URL = "http://127.0.0.1:8000/api/v2";

test("should fetch the current config from the API", async () => {
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
