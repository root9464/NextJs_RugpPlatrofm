'use client';
import { FilterPanel } from './components/filter-panel';
import { HistoryTransactionsHeader } from './components/header';
import { HistoryPanel } from './components/history-panel';

export const HistoryTransactionsModule = () => {
  return (
    <div className='flex h-full w-full flex-col'>
      <HistoryTransactionsHeader />
      <FilterPanel />
      <HistoryPanel />
    </div>
  );
};
