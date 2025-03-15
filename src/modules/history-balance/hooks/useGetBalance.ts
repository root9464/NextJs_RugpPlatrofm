import { UserBalance } from '@/modules/balance/helpers/serialize-balance';
import { coffeApiInstance } from '@/shared/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Address } from '@ton/core';

type PriceResponse = {
  id: number;
  blockchain_id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price_usd: number;
  price_change_24h: number;
  tvl: number;
  holders_count: number;
  image: string;
  external_id: string | null;
  trust_score: number;
  last_updated_at: string;
  stacking_pool_id: string | null;
  stacking_pool: unknown | null;
  labels: string[];
};

const usePrice = (jettons: UserBalance[]) =>
  useQuery({
    queryKey: ['price-jettons', jettons],
    queryFn: async () => {
      const jettonsAddresses = jettons.flatMap((balance) => Address.parse(balance.metadata.contract_address).toString());
      const { data, status, statusText } = await coffeApiInstance.post<PriceResponse[]>('/tokens/by-addresses', jettonsAddresses);
      if (status !== 200) throw new Error(statusText);

      return data;
    },
    enabled: !!jettons,
    refetchInterval: 1000 * 60,
  });

export { usePrice };
export type { PriceResponse };
