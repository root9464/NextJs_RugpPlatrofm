import { UserBalance } from '@/modules/balance/helpers/serialize-balance';
import { PriceResponse } from '../hooks/useGetBalance';

const calculateBalanceInUSD = (balances: UserBalance[], prices: PriceResponse[]): number => {
  const priceMap = new Map<string, number>(prices.map((price) => [price.symbol, price.price_usd]));

  return balances.reduce((total, balance) => {
    const price = priceMap.get(balance.metadata.symbol);
    return price ? total + balance.wallet_info.balance * price : total;
  }, 0);
};

export { calculateBalanceInUSD };
