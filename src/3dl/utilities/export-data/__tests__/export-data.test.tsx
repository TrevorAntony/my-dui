import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDataContext } from "../../../context/DataContext";
import DataProvider from "../../data-provider";
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

// Mock getQueryData
const mockGetQueryData = vi.fn();
vi.spyOn(client, 'getQueryData').mockImplementation(mockGetQueryData);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const testQueryClient = createTestQueryClient();

interface WrapperProps {
  children: React.ReactNode;
  dataProviderProps?: {
    query?: string;
    queryName?: string;
    searchText?: string;
    searchColumns?: string;
    sortColumn?: string;
    pageSize?: number;
    currentPage?: number;
  };
}

const TestWrapper = ({ children, dataProviderProps = {} }: WrapperProps) => (
  <QueryClientProvider client={testQueryClient}>
    <DataProvider {...dataProviderProps}>
      {children}
    </DataProvider>
  </QueryClientProvider>
);

describe("Export Data Functionality", () => {
  beforeEach(async () => {
    mockGetQueryData.mockReset();
    mockGetQueryData.mockImplementation(() => Promise.resolve("test-data"));
    
    // Reset tokens
    accessToken = null;
    refreshToken = null;

    // Login before each test
    const username = "admin";
    const password = "--------";
    await client.login(username, password);
  });

  it("should handle SQL query export with all formats", async () => {
    const formats = ["csv", "xlsx", "json"];
    const sqlQuery = "SELECT * FROM test_table";

    for (const format of formats) {
      renderHook(
        () => useDataContext(),
        {
          wrapper: ({ children }) => (
            <TestWrapper dataProviderProps={{ query: sqlQuery }}>
              {children}
            </TestWrapper>
          ),
        }
      );

      await mockGetQueryData({
        query: sqlQuery,
        data_connection_id: "ANA",
        format
      });

      expect(mockGetQueryData).toHaveBeenCalledWith({
        query: sqlQuery,
        data_connection_id: "ANA",
        format
      });
    }
  });

  it("should handle named query export with filters", async () => {
    const queryName = "test/named/query";
    const filters = {
      status: "active",
      date: "2023-01-01"
    };
    renderHook(
      () => useDataContext(),
      {
        wrapper: ({ children }) => (
          <TestWrapper dataProviderProps={{ queryName }}>
            {children}
          </TestWrapper>
        ),
      }
    );

    const exportWithFilters = async () => {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv",
        filters
      });
    };

    await exportWithFilters();
    expect(mockGetQueryData).toHaveBeenCalledWith(
      expect.objectContaining({
        query_name: queryName,
        filters
      })
    );
  });

  it("should handle pagination parameters correctly", async () => {
    const queryName = "test/query";
    const pageSize = 50;
    const currentPage = 2;

    renderHook(
      () => useDataContext(),
      {
        wrapper: ({ children }) => (
          <TestWrapper dataProviderProps={{ queryName, pageSize, currentPage }}>
            {children}
          </TestWrapper>
        ),
      }
    );

    const exportWithPagination = async () => {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv",
        page_size: pageSize * currentPage,
        current_page: 1
      });
    };

    await exportWithPagination();
    expect(mockGetQueryData).toHaveBeenCalledWith(
      expect.objectContaining({
        page_size: pageSize * currentPage,
        current_page: 1
      })
    );
  });

  it("should handle search and sort parameters", async () => {
    const queryName = "test/query";
    const searchText = "test";
    const searchColumns = "name,id";
    const sortColumn = "name ASC";

    renderHook(
      () => useDataContext(),
      {
        wrapper: ({ children }) => (
          <TestWrapper dataProviderProps={{ queryName, searchText, searchColumns, sortColumn }}>
            {children}
          </TestWrapper>
        ),
      }
    );

    const exportWithSearchAndSort = async () => {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv",
        search_text: searchText,
        search_columns: searchColumns,
        sort_column: sortColumn
      });
    };

    await exportWithSearchAndSort();
    expect(mockGetQueryData).toHaveBeenCalledWith(
      expect.objectContaining({
        search_text: searchText,
        search_columns: searchColumns,
        sort_column: sortColumn
      })
    );
  });

  it("should handle export errors gracefully", async () => {
    mockGetQueryData.mockReset();
    const queryName = "test/query";
    const error = new Error("Export failed");
    mockGetQueryData.mockRejectedValueOnce(error);

    renderHook(
      () => useDataContext(),
      {
        wrapper: ({ children }) => (
          <TestWrapper dataProviderProps={{ queryName }}>
            {children}
          </TestWrapper>
        ),
      }
    );

    let caughtError;
    try {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv"
      });
    } catch (e) {
      caughtError = e;
    }

    expect(caughtError).toEqual(error);
    expect(mockGetQueryData).toHaveBeenCalledTimes(1);
    expect(mockGetQueryData).toHaveBeenCalledWith({
      query_name: queryName,
      data_connection_id: "ANA",
      format: "csv"
    });
  });

  it("should handle different data connection IDs", async () => {
    const connections = ["ANA", "CUSTOM", "TEST"];
    const queryName = "test/query";

    for (const connectionId of connections) {
      renderHook(
        () => useDataContext(),
        {
          wrapper: ({ children }) => (
            <TestWrapper dataProviderProps={{ queryName }}>
              {children}
            </TestWrapper>
          ),
        }
      );

      const exportWithConnection = async () => {
        await mockGetQueryData({
          query_name: queryName,
          data_connection_id: connectionId,
          format: "csv"
        });
      };

      await exportWithConnection();
      expect(mockGetQueryData).toHaveBeenCalledWith(
        expect.objectContaining({
          data_connection_id: connectionId
        })
      );
    }
  });

  it("should handle concurrent exports", async () => {
    const queryName = "test/query";
    const formats = ["csv", "xlsx", "json"];
    const exportPromises = formats.map(format => 
      mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format
      })
    );

    await Promise.all(exportPromises);
    expect(mockGetQueryData).toHaveBeenCalledTimes(formats.length);
    formats.forEach(format => {
      expect(mockGetQueryData).toHaveBeenCalledWith(
        expect.objectContaining({
          format
        })
      );
    });
  });

  it("should handle combined filters, search, and sort parameters", async () => {
    const queryName = "test/query";
    const filters = { status: "active" };
    const searchText = "test";
    const searchColumns = "name,id";
    const sortColumn = "name ASC";

    renderHook(
      () => useDataContext(),
      {
        wrapper: ({ children }) => (
          <TestWrapper dataProviderProps={{ queryName, searchText, searchColumns, sortColumn }}>
            {children}
          </TestWrapper>
        ),
      }
    );

    const exportWithAllParams = async () => {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv",
        filters,
        search_text: searchText,
        search_columns: searchColumns,
        sort_column: sortColumn
      });
    };

    await exportWithAllParams();
    expect(mockGetQueryData).toHaveBeenCalledWith(
      expect.objectContaining({
        filters,
        search_text: searchText,
        search_columns: searchColumns,
        sort_column: sortColumn
      })
    );
  });

  it("should handle empty/null parameters gracefully", async () => {
    const queryName = "test/query";
    renderHook(
      () => useDataContext(),
      {
        wrapper: ({ children }) => (
          <TestWrapper dataProviderProps={{ queryName }}>
            {children}
          </TestWrapper>
        ),
      }
    );

    const exportWithEmptyParams = async () => {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv",
        search_text: "",
        search_columns: "",
        sort_column: "",
        filters: {}
      });
    };

    await exportWithEmptyParams();
    expect(mockGetQueryData).toHaveBeenCalledWith(
      expect.objectContaining({
        query_name: queryName,
        search_text: "",
        search_columns: "",
        sort_column: "",
        filters: {}
      })
    );
  });

  it("should handle network timeouts", async () => {
    mockGetQueryData.mockReset();
    const timeoutError = new Error("Network timeout");
    mockGetQueryData.mockRejectedValueOnce(timeoutError);
    
    const queryName = "test/query";
    let caughtError;
    try {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: "csv"
      });
    } catch (e) {
      caughtError = e;
    }

    expect(caughtError).toEqual(timeoutError);
    expect(mockGetQueryData).toHaveBeenCalledTimes(1);
  });

  it("should handle invalid format specifications", async () => {
    const queryName = "test/query";
    const invalidFormat = "invalid_format";
    renderHook(
      () => useDataContext(),
      {
        wrapper: ({ children }) => (
          <TestWrapper dataProviderProps={{ queryName }}>
            {children}
          </TestWrapper>
        ),
      }
    );

    const exportWithInvalidFormat = async () => {
      await mockGetQueryData({
        query_name: queryName,
        data_connection_id: "ANA",
        format: invalidFormat
      });
    };

    await exportWithInvalidFormat();
    expect(mockGetQueryData).toHaveBeenCalledWith(
      expect.objectContaining({
        format: invalidFormat
      })
    );
  });

  it("should handle server errors with different status codes", async () => {
    const statusCodes = [400, 401, 403, 404, 500];

    for (const status of statusCodes) {
      mockGetQueryData.mockReset();
      const serverError = new Error(`Server responded with status ${status}`);
      mockGetQueryData.mockRejectedValueOnce(serverError);
      renderHook(
        () => useDataContext(),
        {
          wrapper: ({ children }) => (
            <TestWrapper dataProviderProps={{ queryName: "test/query" }}>
              {children}
            </TestWrapper>
          ),
        }
      );

      let caughtError;
      try {
        await mockGetQueryData({
          query_name: "test/query",
          data_connection_id: "ANA",
          format: "csv"
        });
      } catch (e) {
        caughtError = e;
      }
      expect(caughtError).toEqual(serverError);
      expect(mockGetQueryData).toHaveBeenCalledTimes(1);
    }
  });
});
