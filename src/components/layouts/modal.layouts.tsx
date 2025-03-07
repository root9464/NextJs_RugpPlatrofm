import { HistoryTransactionsModule } from '@/modules/history-transactions/module';
import { Fragment, ReactNode } from 'react';

const IndexatorModalLayouts = ({ children_module }: Readonly<{ children_module: ReactNode }>) => (
  <Fragment>
    <div className='absolute z-[4] flex h-full w-full flex-col gap-3'>
      {children_module}
      <div className='h-[108px] w-full bg-lime-400' id='line'>
        линейка
      </div>
    </div>
    <HistoryTransactionsModule />
  </Fragment>
);

export { IndexatorModalLayouts };
