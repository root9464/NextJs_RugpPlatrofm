import { BalanceChartWidget } from './widgets/balance-chart';

export const HistoryBalanceModule = () => {
  return (
    <div className='flex h-full w-full flex-col gap-2.5'>
      <BalanceChartWidget />
    </div>
  );
};
