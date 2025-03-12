import { HistoryTransactionsModule } from '@/modules/history-transactions/module';
import { TimeLineModule } from '@/modules/timeline/module';
import { useParams } from 'next/navigation';
import { ReactNode } from 'react';
import { PageLayout } from './page.layout';

const IndexatorModalLayouts = ({ children_module }: Readonly<{ children_module: ReactNode }>) => {
  const { address } = useParams();
  return (
    <PageLayout className='grid h-full w-full grid-cols-[73%_27%] gap-4'>
      <div className='flex h-full w-full flex-col gap-3' id='modal-workspace'>
        {children_module}
        <TimeLineModule />
      </div>

      <HistoryTransactionsModule address={address as string} />
    </PageLayout>
  );
};

export { IndexatorModalLayouts };
