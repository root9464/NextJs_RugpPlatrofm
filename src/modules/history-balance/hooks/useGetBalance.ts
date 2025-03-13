import { ResponseGetTrHistory } from '@/modules/history-transactions/hooks/useGetTrHistory';
import { handleAction } from '@/modules/history-transactions/utils/utils';
import { tonApiInstance } from '@/shared/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { fromNano } from '@ton/core';

export const useGetBalance = (address: string) =>
  useQuery({
    queryKey: ['get-balance', address],
    queryFn: async () => {
      const { data, status, statusText } = await tonApiInstance.get<ResponseGetTrHistory>(`/accounts/${address}/events`, {
        params: {
          initiator: true,
          subject_only: false,
          limit: 100,
        },
      });
      if (status !== 200) throw new Error(`${status}: ${statusText}`);
      return data;
    },
    select: (data) => {
      const dailyTotals = new Map<string, number>();
      data.events.forEach((event) => {
        const date = new Date(event.timestamp * 1000).toISOString().split('T')[0];
        event.actions.forEach((action) => {
          const rawValue = handleAction(action, {
            TonTransfer: ({ TonTransfer }) => fromNano(TonTransfer.amount),
            JettonTransfer: ({ JettonTransfer }) => {
              const amount = Number(JettonTransfer.amount);
              const decimals = JettonTransfer.jetton.decimals;
              return (amount / 10 ** decimals).toFixed(2);
            },
            SmartContractExec: ({ SmartContractExec }) => fromNano(SmartContractExec.ton_attached),
          });
          const value = Number(rawValue ?? 0);
          dailyTotals.set(date, (dailyTotals.get(date) || 0) + value);
        });
      });

      return Array.from(dailyTotals, ([time, value]) => ({ time, value })).sort((a, b) => a.time.localeCompare(b.time));
    },

    enabled: !!address,
    refetchInterval: 1000 * 60,
  });
