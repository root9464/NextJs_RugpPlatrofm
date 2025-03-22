import { Card } from '@components/ui/card';

import { getMoscowISODate } from '@/shared/utils/utils';
import { lazy, Suspense } from 'react';
import { fetchPriceJettons } from './hooks/useGetBalance';

const BalanceChart = lazy(() => import('./components/chart').then((module) => ({ default: module.BalanceChart })));

export const HistoryBalanceModule = async ({ address }: { address: string }) => {
  const prices = await fetchPriceJettons(address ?? '');
  const chartData = {
    time: getMoscowISODate(),
    value: prices?.balanceInUsd ?? 0,
  };

  return (
    <div className='flex h-max w-full flex-col gap-2.5'>
      <Card className='bg-uiSecondaryBg flex flex-col gap-5 border-0 border-none text-white'>
        <Card.Header className='flex w-full flex-row items-center justify-between pb-0'>
          <div className='flex items-center gap-2'>
            <h2 className='text-xl font-bold'>Balance History</h2>
            <p className='text-uiPrimaryText'>10 Mar, 2023 - 30 Dec. 2023</p>
          </div>
        </Card.Header>
        <Card.Content className='z-0 border-none px-0'>
          <Suspense fallback={<p>Loading...</p>}>
            <BalanceChart data={[chartData]} />
          </Suspense>
        </Card.Content>
      </Card>
    </div>
  );
};
