import { FilterPanel } from './components/filter-panel';
import { HistoryTransactionsHeader } from './components/header';
import { HistoryPanel } from './components/history-panel';
import { getTransactionsHistory } from './hooks/useGetTrHistory';

export const HistoryTransactionsModule = async ({ address }: { address: string }) => {
  const transactions = await getTransactionsHistory(address);

  return (
    <div className='flex h-full w-full flex-col'>
      <HistoryTransactionsHeader />
      <FilterPanel />
      <HistoryPanel transactions={transactions} />
    </div>
  );
};
