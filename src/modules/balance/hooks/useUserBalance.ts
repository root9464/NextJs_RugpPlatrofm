import { tonCenterInstance } from '@shared/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { serializeUserBalance, UserBalance } from '../helpers/serialize-balance';

type JettonWallet = {
  address: string;
  balance: string;
  owner: string;
  jetton: string;
  last_transaction_lt: string;
  code_hash: string;
  data_hash: string;
};

type AddressBookEntry = {
  user_friendly: string;
  domain: string | null;
};

type ItemInfo = {
  type: string;
  name: string;
  symbol: string;
  description: string;
  image?: string;
  extra: Record<string, string>;
};

type MetadataEntry = {
  is_indexed: boolean;
  token_info: ItemInfo[];
};

type JettonBalance = {
  jetton_wallets: JettonWallet[];
  address_book: Record<string, AddressBookEntry>;
  metadata: Record<string, MetadataEntry>;
};

type TonBalance = {
  ok: boolean;
  result: string;
};

const fetchUserBalance = async (address: string): Promise<UserBalance[]> => {
  const [jettonsResponse, accountResponse]: [AxiosResponse<JettonBalance> | null, AxiosResponse<TonBalance> | null] = await Promise.all([
    tonCenterInstance.get(`/v3/jetton/wallets`, {
      params: {
        owner_address: address,
        exclude_zero_balance: true,
        offset: 0,
      },
    }),
    tonCenterInstance.get(`/v2/getAddressBalance`, {
      params: {
        address: address,
      },
    }),
  ]).catch((error: AxiosError) => {
    throw new Error(`API fetch failed: ${error.message}`);
  });
  if (!accountResponse || !jettonsResponse) throw new Error('Failed to fetch account data.');

  const jettonBalances = serializeUserBalance(jettonsResponse.data);

  const tonBalance: UserBalance = {
    wallet_info: {
      address: address,
      user_friendly: accountResponse.data.result,
      balance: Number(accountResponse.data.result) / 10 ** 9,
      owner: { raw: address, friendly: accountResponse.data.result },
      last_transaction_lt: 0,
    },

    metadata: {
      contract_address: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ',
      name: 'TON',
      symbol: 'TON',
      description: 'TON',
      decimals: 9,
    },
  };

  return [tonBalance, ...jettonBalances];
};

const useUserBalance = (address: string) =>
  useQuery({
    queryKey: ['user-balance', address],
    queryFn: () => fetchUserBalance(address),
    enabled: !!address,
  });

export { fetchUserBalance, useUserBalance };
export type { ItemInfo, JettonBalance, TonBalance };
