import { tonApiInstance } from '@shared/lib/axios';
import { validateResult } from '@shared/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { z } from 'zod';

const ExtraBalanceSchema = z.object({
  amount: z.string(),
  preview: z.object({
    id: z.number(),
    symbol: z.string(),
    decimals: z.number(),
    image: z.string().url(),
  }),
});

const AccountSchema = z.object({
  address: z.string(),
  balance: z.number(),
  extra_balance: z.array(ExtraBalanceSchema).optional().default([]),
  currencies_balance: z.record(z.unknown()).optional().default({}),
  last_activity: z.number(),
  status: z.string(),
  interfaces: z.array(z.string()),
  name: z.string().optional(),
  is_scam: z.boolean().optional().default(false),
  icon: z.string().url().optional(),
  memo_required: z.boolean().optional().default(false),
  get_methods: z.array(z.string()).optional().default([]),
  is_suspended: z.boolean().optional().default(false),
  is_wallet: z.boolean(),
});

const PriceSchema = z.object({
  prices: z.object({
    TON: z.number(),
    USD: z.number(),
  }),
  diff_24h: z.object({
    TON: z.string(),
    USD: z.string(),
  }),
  diff_7d: z.object({
    TON: z.string(),
    USD: z.string(),
  }),
  diff_30d: z.object({
    TON: z.string(),
    USD: z.string(),
  }),
});

const WalletAddressSchema = z.object({
  address: z.string(),
  is_scam: z.boolean(),
  is_wallet: z.boolean(),
});

const JettonSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  image: z.string().url(),
  verification: z.string(),
  score: z.number(),
});

const JettonBalanceSchema = z.object({
  balance: z.string(),
  price: PriceSchema,
  wallet_address: WalletAddressSchema,
  jetton: JettonSchema,
});

const JettonsSchema = z.object({
  balances: z.array(JettonBalanceSchema),
});

type AccountType = z.infer<typeof AccountSchema>;
type JettonBalanceType = z.infer<typeof JettonBalanceSchema>;
export type Jetton = {
  balance: number;
  image: string;
  symbol: string;
  decimals: number;
  address: string;
  price_ton: number;
};

export async function fetchUserBalance(address: string): Promise<Jetton[]> {
  try {
    const [accountResponse, jettonsResponse]: [AxiosResponse<AccountType> | null, AxiosResponse<JettonBalanceType> | null] = await Promise.all([
      tonApiInstance.get(`/accounts/${address}`),
      tonApiInstance.get(`/accounts/${address}/jettons?currencies=ton,usd`),
    ]).catch((error: AxiosError) => {
      throw new Error(`API fetch failed: ${error.message}`);
    });
    const account = validateResult(accountResponse.data, AccountSchema);
    if (!account) throw new Error('Failed to fetch account data.');

    const jettons = validateResult(jettonsResponse.data, JettonsSchema);

    const tonBalance = {
      balance: account.balance / 10 ** 9,
      image: 'native',
      symbol: 'TON',
      decimals: 9,
      address: account.address,
      price_ton: account.balance / 10 ** 9,
    };

    const jettonBalances = jettons.balances.map((jetton) => ({
      balance: Number(jetton.balance) / 10 ** jetton.jetton.decimals,
      image: jetton.jetton.image,
      symbol: jetton.jetton.symbol,
      decimals: jetton.jetton.decimals,
      address: jetton.jetton.address,
      price_ton: jetton.price.prices.TON,
    }));

    return [tonBalance, ...jettonBalances];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API fetch failed: ${error.message}`);
    }
    throw error;
  }
}

export const useUserBalance = (address: string) =>
  useQuery({
    queryKey: ['balance', address],
    queryFn: async () => await fetchUserBalance(address),
    enabled: !!address,
  });
