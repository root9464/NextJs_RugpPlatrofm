import { HistoryTransactionsModule } from '@/modules/history-transactions/module';
import { TimeLineModule } from '@/modules/timeline/module';
import { useParams } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { PageLayout } from './page.layout';

const IndexatorModalLayouts = ({ children_module }: Readonly<{ children_module: ReactNode }>) => {
  const { address } = useParams();
  return (
    <PageLayout className='grid h-full w-full grid-cols-[73%_27%] gap-4'>
      <div className='flex h-full w-fit flex-col gap-3' id='modal-workspace'>
        {children_module}
        <TimeLineModule />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <HistoryTransactionsModule address={address as string} />
      </Suspense>
    </PageLayout>
  );
};

export { IndexatorModalLayouts };
