import { tonCenterInstance } from '@/shared/lib/axios';
import { useQuery } from '@tanstack/react-query';

type ResponseGetBalance = {
  ok: boolean;
  result: string;
};

export const useGetBalance = (address: string) =>
  useQuery({
    queryKey: ['get-balance', address],
    queryFn: async () => {
      const { data, status, statusText } = await tonCenterInstance.get<ResponseGetBalance>(`/getAddressBalance?address=${address}`);
      if (status !== 200) throw new Error(`${status}: ${statusText}`);

      return {
        time: Math.floor(Date.now() / 1000),
        value: Number(data.result) / 10 ** 9,
      };
    },
    enabled: !!address,
    refetchInterval: 1000 * 60,
  });
