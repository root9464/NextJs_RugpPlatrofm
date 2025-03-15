import { fetchUserBalance } from '@/modules/balance/hooks/useUserBalance';
import { coffeApiInstance } from '@/shared/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Address } from '@ton/core';
import { calculateBalanceInUSD } from '../utils/utils';

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

const usePrice = (address: string) =>
  useQuery({
    queryKey: ['price-jettons', address],
    queryFn: async () => {
      const userBalance = await fetchUserBalance(address);

      if (!userBalance) throw new Error('Failed to fetch account data.');

      const jettonsAddresses = userBalance.flatMap((balance) => Address.parse(balance.metadata.contract_address).toString());

      const { data: jettonsPrices, status, statusText } = await coffeApiInstance.post<PriceResponse[]>('/tokens/by-addresses', jettonsAddresses);
      if (status !== 200) throw new Error(statusText);

      const balanceInUsd = calculateBalanceInUSD(userBalance, jettonsPrices);

      return { balanceInUsd, jettonsPrices };
    },
    enabled: !!address,
    refetchInterval: 1000 * 60,
  });

export { usePrice };
export type { PriceResponse };
