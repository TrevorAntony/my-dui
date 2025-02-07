import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDataContext } from "../../../core/context/DataContext";
import { DuftHttpClient } from "../../../core/api/DuftHttpClient/DuftHttpClient";

interface UseApiFetchProps {
  url: string;
  params?: Record<string, any>;
  client: DuftHttpClient;
  queryKey?: string | string[];
}

export const useApiFetch = ({
  url,
  params,
  client,
  queryKey = "api-data",
}: UseApiFetchProps) => {
  const { setData, setDatasetParams } = useDataContext();

  const { data, error, isLoading } = useQuery({
    queryKey: [queryKey, url, params],
    queryFn: async () => {
      if (!params) {
        return client.fetchData(url);
      }

      // Append params to URL if GET request
      const queryParams = new URLSearchParams(params).toString();
      const finalUrl = queryParams ? `${url}?${queryParams}` : url;

      return client.fetchData(finalUrl);
    },
    enabled: !!url,
  });

  useEffect(() => {
    setDatasetParams((prev) => ({ ...prev, loading: isLoading, error: null }));
  }, [isLoading, setDatasetParams]);

  useEffect(() => {
    if (data) {
      setData(data as any[]);
    }
  }, [data, setData]);

  useEffect(() => {
    if (error) {
      setDatasetParams((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error("An error occurred"),
      }));
    }
  }, [error, setDatasetParams]);
};

interface APIProps extends UseApiFetchProps {}

const ApiData: React.FC<APIProps> = (props) => {
  useApiFetch(props);
  return null;
};

export default ApiData;
