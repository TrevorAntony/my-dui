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

const useThemeData = () => {
  const [themeData, setThemeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // const authenticationEnabled = useDuftConfigurations();
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await client.getTheme();
        setThemeData(data as object);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);
  return { themeData, loading, error };

  //refactor that uses React Query
  // const {
  //   data: themeData,
  //   error,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ['theme'], // Unique query key
  //   queryFn: async () => {
  //     return await client.getTheme();
  //   },
  //   retry: 2, // Retry the query twice on failure
  //   refetchOnWindowFocus: false, // Disable refetch on window focus (optional)
  // });
  // return {
  //   themeData,
  //   error,
  //   isLoading,
  // };
};

export default useThemeData;
