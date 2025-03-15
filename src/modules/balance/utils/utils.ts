import { PriceResponse } from '@/modules/history-balance/hooks/useGetBalance';
import { UserBalance } from '../helpers/serialize-balance';

const mapBalancesToTable = (balances: UserBalance[], prices: PriceResponse[]) => {
  const priceMap = new Map<string, number>(prices.map((price) => [price.symbol, price.price_usd]));

  return balances
    .filter((balance) => priceMap.has(balance.metadata.symbol))
    .map((balance) => ({
      symbol: balance.metadata.symbol,
      balance: balance.wallet_info.balance,
      priceUsd: priceMap.get(balance.metadata.symbol)! * balance.wallet_info.balance,
    }));
};

export { mapBalancesToTable };
