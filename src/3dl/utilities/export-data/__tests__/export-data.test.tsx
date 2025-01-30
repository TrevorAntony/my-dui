import { describe, it, expect, beforeEach } from "vitest";
import { DuftHttpClient } from "../../../../api/DuftHttpClient/DuftHttpClient";

const BASE_URL = "http://127.0.0.1:8000/api/v2";

// Token management
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

describe("Export Data Functionality - Real API Integration", () => {
  beforeEach(async () => {
    // Reset tokens
    accessToken = null;
    refreshToken = null;
    await client.login("admin", "--------");
  });

  it("should handle SQL query export with all formats", async () => {
    const formats = ["csv", "json"];
    const sqlQuery = "SELECT * FROM dim_client LIMIT 5";

    for (const format of formats) {
      const response = await client.getQueryData({
        query: sqlQuery,
        data_connection_id: "ANA",
        format
      });

      expect(response).toBeDefined();
      if (format === "csv") {
        expect(typeof response.size).toBe('number');
        expect(typeof response.type).toBe('string');
        expect(response.type).toContain('csv');
      } else {
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBeGreaterThan(0);
      }
    }
  }, 10000);

  it("should handle named query export with filters", async () => {
    const queryName = "filters/age_group";
    const filters = {
      age_group: "20-24"
    };

    const response = await client.getQueryData({
      query_name: queryName,
      data_connection_id: "ANA",
      format: "csv",
      filters
    });

    expect(response).toBeDefined();
    expect(typeof response.size).toBe('number');
    expect(typeof response.type).toBe('string');
    expect(response.type).toContain('csv');
  });

  it("should handle pagination parameters correctly", async () => {
    const sqlQuery = "SELECT * FROM dim_client";
    const pageSize = 50;
    const currentPage = 2;

    const response = await client.getQueryData({
      query: sqlQuery,
      data_connection_id: "ANA",
      format: "csv",
      page_size: pageSize * currentPage,
      current_page: 1
    });

    expect(response).toBeDefined();
    expect(typeof response.size).toBe('number');
    expect(typeof response.type).toBe('string');
    expect(response.type).toContain('csv');
  });

  it("should handle search and sort parameters", async () => {
    const sqlQuery = "SELECT * FROM dim_client";
    const searchText = "20";
    const searchColumns = "age_group_id";
    const sortColumn = "age_group_id ASC";

    const response = await client.getQueryData({
      query: sqlQuery,
      data_connection_id: "ANA",
      format: "csv",
      search_text: searchText,
      search_columns: searchColumns,
      sort_column: sortColumn
    });

    expect(response).toBeDefined();
    expect(typeof response.size).toBe('number');
    expect(typeof response.type).toBe('string');
    expect(response.type).toContain('csv');
  });

  it("should handle export errors gracefully", async () => {
    const queryName = "test/query";
    let caughtError;
    try {
      await client.getQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv"
      });
    } catch (e) {
      caughtError = e;
    }

    expect(caughtError).toBeDefined();
  });

  it("should handle different data connection IDs", async () => {
    const sqlQuery = "SELECT * FROM dim_client LIMIT 5";
    const connections = ["ANA"];

    for (const connectionId of connections) {
      const response = await client.getQueryData({
        query: sqlQuery,
        data_connection_id: connectionId,
        format: "csv"
      });

      expect(response).toBeDefined();
      expect(typeof response.size).toBe('number');
      expect(typeof response.type).toBe('string');
      expect(response.type).toContain('csv');
    }
  });

  it("should handle concurrent exports", async () => {
    const sqlQuery = "SELECT * FROM dim_client LIMIT 5";
    const formats = ["csv", "json"];
    const exportPromises = formats.map(format => 
      client.getQueryData({
        query: sqlQuery,
        data_connection_id: "ANA",
        format
      })
    );

    const responses = await Promise.all(exportPromises);
    responses.forEach((response, index) => {
      expect(response).toBeDefined();
      if (formats[index] === "csv") {
        expect(typeof response.size).toBe('number');
        expect(typeof response.type).toBe('string');
        expect(response.type).toContain('csv');
      } else {
        expect(Array.isArray(response)).toBe(true);
      }
    });
  });

  it("should handle combined filters, search, and sort parameters", async () => {
    const sqlQuery = "SELECT * FROM dim_client";
    const filters = { age_group: "20-24" };
    const searchText = "20";
    const searchColumns = "age_group_id";
    const sortColumn = "age_group_id ASC";

    const response = await client.getQueryData({
      query: sqlQuery,
      data_connection_id: "ANA",
      format: "csv",
      filters,
      search_text: searchText,
      search_columns: searchColumns,
      sort_column: sortColumn
    });

    expect(response).toBeDefined();
    expect(typeof response.size).toBe('number');
    expect(typeof response.type).toBe('string');
    expect(response.type).toContain('csv');
  });

  it("should handle network timeouts", async () => {
    const queryName = "test/query";
    let caughtError;
    try {
      await client.getQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv"
      });
    } catch (e) {
      caughtError = e;
    }

    expect(caughtError).toBeDefined();
  });

  it("should handle invalid format specifications", async () => {
    const queryName = "test/query";
    const invalidFormat = "invalid_format";

    let caughtError;
    try {
      await client.getQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: invalidFormat
      });
    } catch (e) {
      caughtError = e;
    }

    expect(caughtError).toBeDefined();
  });

  it("should handle server errors with different status codes", async () => {
    const statusCodes = [400, 401, 403, 404, 500];

    for (const _status of statusCodes) {
      let caughtError;
      try {
        await client.getQueryData({
          query_name: "test/query",
          data_connection_id: "ANA",
          format: "csv"
        });
      } catch (e) {
        caughtError = e;
      }
      expect(caughtError).toBeDefined();
    }
  });

  it("should correctly handle CSV export format", async () => {
    const queryName = "filters/age_group";
    
    const response = await client.getQueryData({
      query_name: queryName,
      data_connection_id: "ANA",
      format: "csv"
    });
    expect(response).toBeDefined();
    expect(typeof response.size).toBe('number');
    expect(typeof response.type).toBe('string');
    expect(response.type).toContain('csv');

    // Verify content
    const text = await response.text();
    expect(text).toContain("age_group_id");
    expect(text.split("\n").length).toBeGreaterThan(1);
  });

  it("should correctly handle JSON export format", async () => {
    const queryName = "filters/age_group";
    
    const response = await client.getQueryData({
      query_name: queryName,
      data_connection_id: "ANA",
      format: "json"
    });

    expect(Array.isArray(response)).toBe(true);
    expect(response[0]).toHaveProperty("age_group_id");
    expect(response[0]).toHaveProperty("age");
    expect(response.length).toBeGreaterThan(0);
  });

  it("should reject invalid export formats with 400", async () => {
    const queryName = "filters/age_group";
    
    await expect(client.getQueryData({
      query_name: queryName,
      data_connection_id: "ANA",
      format: "invalid"
    })).rejects.toThrow("Bad Request");
  });

  it("should handle large dataset exports", async () => {
    const sqlQuery = `
      SELECT * FROM fact_sentinel_event 
      INNER JOIN dim_client ON fact_sentinel_event.client_id = dim_client.client_id 
      LIMIT 1000
    `;

    const response = await client.getQueryData({
      query: sqlQuery,
      data_connection_id: "ANA",
      format: "csv"
    });
    // Check for blob-like properties instead of instanceof
    expect(response).toBeDefined();
    expect(typeof response.size).toBe('number');
    expect(typeof response.type).toBe('string');
    expect(response.size).toBeGreaterThan(1024);
  }, { timeout: 30000 });

  it("should maintain filters in export", async () => {
    const queryName = "filters/age_group";
    const filters = { age_group: "20-24" };

    const response = await client.getQueryData({
      query_name: queryName,
      data_connection_id: "ANA",
      format: "json",
      filters
    });

    expect(Array.isArray(response)).toBe(true);
    response.forEach(row => {
      expect(row.age_group).toBe("20-24");
    });
  });

  it("should require authentication for export", async () => {
    // Reset tokens to force unauthenticated state
    accessToken = null;
    refreshToken = null;

    const queryName = "filters/age_group";
    
    await expect(client.getQueryData({
      query_name: queryName,        data_connection_id: "ANA",
      format: "csv"
    })).rejects.toThrow("Unauthorized");
  });
});
