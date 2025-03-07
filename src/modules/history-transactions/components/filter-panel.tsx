import { AssetsMenu } from '../entities/assets-menu';
import { DateMenu } from '../entities/date-menu';
import { TransactionsMenu } from '../entities/transactions-menu';

export const FilterPanel = () => {
  return (
    <div className='border-y-uiMutedPrimary flex h-20 w-full items-center justify-center border border-x-0 bg-transparent p-4'>
      <div className='grid grid-cols-3 gap-6'>
        <TransactionsMenu />
        <DateMenu />
        <AssetsMenu />
      </div>
    </div>
  );
};
