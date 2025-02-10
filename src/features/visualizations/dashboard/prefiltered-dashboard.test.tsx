import { expect, test, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DuftHttpClient } from "../../../core/api/DuftHttpClient/DuftHttpClient";
import PrefilteredDashboard from "./prefiltered-dashboard";
import Dashboard, { setFilter, useDashboardContext } from "./Dashboard";
import { useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/v2";

// Token management setup
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

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

beforeEach(async () => {
  accessToken = null;
  refreshToken = null;

  const username = "admin";
  const password = "--------";
  await client.login(username, password);
});

test("renders error message when required filters are missing", () => {
  const testQueryClient = createTestQueryClient();

  const { container } = render(
    <QueryClientProvider client={testQueryClient}>
      <Dashboard>
        <PrefilteredDashboard filters="gender,age_group">
          <div>Dashboard content</div>
        </PrefilteredDashboard>
      </Dashboard>
    </QueryClientProvider>
  );

  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(
    screen.getByText(/Please select the following filters/i)
  ).toBeInTheDocument();
  expect(screen.getByText("gender")).toBeInTheDocument();
  expect(screen.getByText("age_group")).toBeInTheDocument();
  expect(container.textContent).not.toContain("Dashboard content");
});

test("renders children when all required filters are set", () => {
  const testQueryClient = createTestQueryClient();

  const TestWrapper = () => {
    const context = useDashboardContext();
    useEffect(() => {
      if (context) {
        setFilter(context.dispatch, "gender", "F");
        setFilter(context.dispatch, "age_group", "20-24");
      }
    }, []);

    return (
      <PrefilteredDashboard filters=" gender,age_group">
        <div>Dashboard content</div>
      </PrefilteredDashboard>
    );
  };

  const { container } = render(
    <QueryClientProvider client={testQueryClient}>
      <Dashboard>
        <TestWrapper />
      </Dashboard>
    </QueryClientProvider>
  );

  expect(container.textContent).toContain("Dashboard content");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
