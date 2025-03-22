import { FilterPanel } from './components/filter-panel';
import { HistoryTransactionsHeader } from './components/header';
import { HistoryPanel } from './components/history-panel';
import { getTransactionsHistory } from './hooks/useGetTrHistory';

export const HistoryTransactionsModule = async ({ address }: { address: string }) => {
  const transactionsData = await getTransactionsHistory(address);

  return (
    <div className='flex h-full w-full flex-col'>
      <HistoryTransactionsHeader name={'hotdog-off-lab.ton'} address={address} createdAt={'2023-01-01'} />
      <FilterPanel />
      <HistoryPanel transactions={transactionsData?.transactions ?? []} address={address} />
    </div>
  );
};
