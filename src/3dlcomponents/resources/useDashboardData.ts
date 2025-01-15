import { useQuery } from '@tanstack/react-query';
import { client } from "../..";

const useDashboardData = (id: string) => {
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboardData', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await client.getDashboardFile(id);
      return (data as string)
        .replace(/>\s+</g, '><')
        .replace(/<>\s*<\/>/g, '');
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return dashboardData;
};

export default useDashboardData;
