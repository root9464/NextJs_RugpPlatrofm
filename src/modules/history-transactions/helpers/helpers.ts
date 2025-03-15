import { JettonTransferAction, TransactionData } from '@/modules/history-transactions/hooks/useGetTrHistory';

type SerializedTransaction = {
  type: 'TON Transfer' | 'Jetton Transfer';
  status: string;
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  currency: string;
  comment: string | null;
  hash: string;
  forward_amount?: string;
  token?: {
    name: string;
    symbol: string;
    decimals: number;
    contract: string;
  };
};

type SerializedSummary = {
  total_ton_received: number;
  total_ton_sent: number;
  total_jettons_sent: Record<string, number>;
  interaction_counterparties: string[];
};

type SerializedTransactionData = {
  transactions: SerializedTransaction[];
  summary: SerializedSummary;
};

const serializeTransactionData = (data: TransactionData, address: string): SerializedTransactionData => {
  const transactions: SerializedTransaction[] = data.actions.map((action) => {
    const baseFields = {
      status: action.success ? 'Success' : 'Failed',
      timestamp: action.end_utime,
      hash: action.trace_external_hash,
      comment: action.type === 'ton_transfer' ? action.details.comment : (action as JettonTransferAction).details.comment,
    };

    if (action.type === 'ton_transfer') {
      const details = action.details;
      return {
        ...baseFields,
        type: 'TON Transfer',
        from: data.address_book[details.source]?.user_friendly || details.source,
        to: data.address_book[details.destination]?.user_friendly || details.destination,
        amount: parseInt(details.value) / 10 ** 9,
        currency: 'TON',
      } as SerializedTransaction;
    } else {
      const details = action.details;
      const tokenInfo = data.metadata[details.asset]?.token_info[0];
      const decimals = parseInt(tokenInfo?.extra.decimals ?? '0');

      return {
        ...baseFields,
        type: 'Jetton Transfer',
        from: data.address_book[details.sender]?.user_friendly ?? details.sender,
        to: data.address_book[details.receiver]?.user_friendly ?? details.receiver,
        amount: parseInt(details.amount) / 10 ** decimals,
        currency: tokenInfo?.symbol ?? 'JETTON',
        forward_amount: details.forward_amount,
        token: tokenInfo
          ? {
              name: tokenInfo.name,
              symbol: tokenInfo.symbol,
              decimals: decimals,
              contract: details.asset,
            }
          : undefined,
      } as SerializedTransaction;
    }
  });

  const summary = transactions.reduce(
    (acc, tx) => {
      [tx.from, tx.to].forEach((addr) => {
        if (addr !== address) acc.interaction_counterparties.add(addr);
      });

      if (tx.type === 'TON Transfer') {
        if (tx.to === address) acc.total_ton_received += tx.amount;
        if (tx.from === address) acc.total_ton_sent += tx.amount;
      } else if (tx.token) {
        const key = `${tx.token.symbol}-${tx.token.contract}`;
        acc.total_jettons_sent[key] = (acc.total_jettons_sent[key] || 0) + tx.amount;
      }

      return acc;
    },
    {
      total_ton_received: 0,
      total_ton_sent: 0,
      total_jettons_sent: {} as Record<string, number>,
      interaction_counterparties: new Set<string>(),
    },
  );

  return {
    transactions,
    summary: {
      ...summary,
      interaction_counterparties: Array.from(summary.interaction_counterparties),
    },
  };
};

export { serializeTransactionData, type SerializedTransaction, type SerializedTransactionData };
