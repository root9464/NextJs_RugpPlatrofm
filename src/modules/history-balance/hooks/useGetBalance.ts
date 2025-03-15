import { tonApiInstance } from '@/shared/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useGetBalance = (address: string) =>
  useQuery({
    queryKey: ['get-balance', address],
    queryFn: async () => {
      const { data, status, statusText } = await tonApiInstance.get(`/accounts/${address}/events`, {
        params: {
          initiator: true,
          subject_only: false,
          limit: 100,
        },
      });
      if (status !== 200) throw new Error(`${status}: ${statusText}`);
      return data;
    },
    enabled: !!address,
    refetchInterval: 1000 * 60,
  });
