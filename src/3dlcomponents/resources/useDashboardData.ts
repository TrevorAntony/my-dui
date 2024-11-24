import { useState, useEffect } from "react";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";
import config from "../../config";
import {
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
} from "../../api/DuftHttpClient/local-storage-functions";

const client = new DuftHttpClient(
  config.apiBaseUrl,
  getTokenFromLocalStorage,
  setTokenInLocalStorage
);

const useDashboardData = (id: string) => {
  const [dashboardData, setDashboardData] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      client
        .getDashboardFile(id)
        .then((data) => {
          // Remove unnecessary whitespace and empty fragments
          const cleanedJSX = (data as string)
            .replace(/>\s+</g, "><") // Remove whitespace between tags
            .replace(/<>\s*<\/>/g, ""); // Remove empty fragments

          setDashboardData(cleanedJSX);
        })
        .catch((error) => console.error("Error loading dashboard data", error));
    }
  }, [id]);

  return dashboardData;

  //refactor to use React Query
  // const {
  //   data: dashboardData,
  //   error,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ['dashboardData', id], // Unique query key with dependency
  //   queryFn: async () => {
  //     if (!id) {
  //       throw new Error('Dashboard ID is required');
  //     }

  //     const data = await client.getDashboardFile(id);

  //     // Remove unnecessary whitespace and empty fragments
  //     return (data as string)
  //       .replace(/>\s+</g, '><') // Remove whitespace between tags
  //       .replace(/<>\s*<\/>/g, ''); // Remove empty fragments
  //   },
  //   enabled: !!id, // Only fetch data if `id` is provided
  //   retry: 2, // Retry twice on failure
  //   refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
  // });

  // return {
  //   dashboardData,
  //   error,
  //   isLoading,
  // };
};

export default useDashboardData;
