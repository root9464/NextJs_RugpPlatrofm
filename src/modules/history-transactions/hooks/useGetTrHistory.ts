import { tonCenterInstance } from '@/shared/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { serializeTransactionData } from '../helpers/helpers';

type TransactionAction = TonTransferAction | JettonTransferAction;

type BaseAction = {
  trace_id: string;
  action_id: string;
  start_lt: string;
  end_lt: string;
  start_utime: number;
  end_utime: number;
  success: boolean;
  transactions: string[];
  trace_external_hash: string;
};

type TonTransferAction = BaseAction & {
  type: 'ton_transfer';
  details: {
    source: string;
    destination: string;
    value: string;
    comment: string;
    encrypted: boolean;
    value_extra_currencies: Record<string, never>;
  };
};

type JettonTransferAction = BaseAction & {
  type: 'jetton_transfer';
  details: {
    asset: string;
    sender: string;
    receiver: string;
    sender_jetton_wallet: string;
    receiver_jetton_wallet: string;
    amount: string;
    comment: string;
    is_encrypted_comment: boolean;
    query_id: string;
    response_destination: string;
    custom_payload: null;
    forward_payload: string | null;
    forward_amount: string;
  };
};

type AddressBook = Record<
  string,
  {
    user_friendly: string;
    domain: string | null;
  }
>;

type TokenMetadata = {
  is_indexed: boolean;
  token_info: {
    type: 'jetton_masters';
    name: string;
    symbol: string;
    description: string;
    image: string;
    extra: {
      _image_big: string;
      _image_medium: string;
      _image_small: string;
      decimals: string;
    };
  }[];
};

type TransactionData = {
  actions: TransactionAction[];
  address_book: AddressBook;
  metadata: Record<string, TokenMetadata>;
};

const getTransactionsHistory = async (address: string) => {
  const { data, status, statusText } = await tonCenterInstance.get<TransactionData>(`v3/actions?account=${address}`, {
    params: {
      sort: 'desc',
      limit: 100,
    },
  });

  if (status !== 200) throw new Error(statusText);

  return serializeTransactionData(data, address);
};

const useTransactionsHistory = (address: string) =>
  useQuery({
    queryKey: ['transactions-history', address],
    queryFn: () => getTransactionsHistory(address),
    enabled: !!address,
  });

export { getTransactionsHistory, useTransactionsHistory };
export type { JettonTransferAction, TonTransferAction, TransactionAction, TransactionData };
