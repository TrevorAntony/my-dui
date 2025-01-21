import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDataContext } from "../context/DataContext";
import { OpenMRSClient } from "../../api/OpenmrsHttpClient/OpenmrsHttpClient";

interface UseOpenmrsFetchProps {
  resource: string;
  resourceId?: string;
  params?: Record<string, any>;
  client: OpenMRSClient;
  queryKey?: string | string[];
  method?: "GET" | "POST";
  body?: object;
  transformData?: string | boolean;
}

export const useOpenmrsFetch = ({
  resource,
  resourceId,
  params,
  client,
  queryKey = "openmrs-data",
  method = "GET",
  body,
  transformData = false, //TO-DO: this should be a key to a function that transforms the data
}: UseOpenmrsFetchProps) => {
  const { setData, setDatasetParams } = useDataContext();

  const { data, error, isLoading } = useQuery({
    queryKey: [queryKey, resource, resourceId, params, method, body],
    queryFn: async () => {
      const path = resourceId ? `${resource}/${resourceId}` : resource;
      return client.fetchResource(path, params, method, body, transformData);
    },
    enabled: !!resource,
  });

  useEffect(() => {
    setDatasetParams((prev) => ({ ...prev, loading: isLoading, error: null }));
  }, [isLoading, setDatasetParams]);

  useEffect(() => {
    if (data) {
      setData(data);
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

interface OpenmrsDataProps extends UseOpenmrsFetchProps {}

const OpenmrsData: React.FC<OpenmrsDataProps> = (props) => {
  useOpenmrsFetch(props);
  return null;
};

export default OpenmrsData;
