import { PageLayout } from '@/components/layouts/page.layout';
import { fetchUserBalance } from '@/modules/balance/hooks/useUserBalance';
import { NodeGraphModule } from '@/modules/node-graph/module';
import { TimeLineModule } from '@/modules/timeline/module';
import { ProfileModule } from '@modules/profile/module';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { lazy } from 'react';

const BalanceModule = lazy(() =>
  import('@modules/balance/module').then((module) => ({
    default: module.BalanceModule,
  })),
);

const HistoryTransactionsModule = lazy(() =>
  import('@modules/history-transactions/module').then((module) => ({
    default: module.HistoryTransactionsModule,
  })),
);

const HistoryBalanceModule = dynamic(() => import('@modules/history-balance/module').then((mod) => mod.HistoryBalanceModule), { ssr: false });

const address = 'UQA_rGxGSOngCzBbPlQ69GH9Co0qYGeNWVixVi87cDgWj9CY';
export default async function IndexatorPage({ params }: { params: { address: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['balance', address],
    queryFn: () => fetchUserBalance(address),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageLayout className='z-0 grid grid-cols-[73%_27%] gap-4'>
        <div className='flex h-full w-full flex-col gap-3' id='workspace'>
          <div className='grid h-full w-full grid-cols-[calc(30%-10px)_calc(70%-10px)] gap-5'>
            <div className='flex h-full w-full flex-col gap-5'>
              <ProfileModule />
              <BalanceModule address={params.address} />
            </div>

            <div className='flex h-full w-full flex-col gap-5'>
              <HistoryBalanceModule address={params.address} />
              <NodeGraphModule />
            </div>
          </div>

          <TimeLineModule />
        </div>

        <HistoryTransactionsModule address={params.address} />
      </PageLayout>
    </HydrationBoundary>
  );
}
