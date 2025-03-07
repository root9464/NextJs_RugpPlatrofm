import { HistoryTransactionsModule } from '@/modules/history-transactions/module';
import { TimeLineModule } from '@/modules/timeline/module';
import { ReactNode } from 'react';
import { PageLayout } from './page.layout';

const IndexatorModalLayouts = ({ children_module }: Readonly<{ children_module: ReactNode }>) => (
  <PageLayout className='grid h-full w-full grid-cols-[73%_27%] gap-4'>
    <div className='flex h-full w-full flex-col gap-3' id='modal-workspace'>
      {children_module}
      <TimeLineModule />
    </div>

    <HistoryTransactionsModule />
  </PageLayout>
);

export { IndexatorModalLayouts };
