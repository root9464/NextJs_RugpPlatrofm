import { IconX } from 'justd-icons';
import { AssetsMenu } from '../entities/assets-menu';
import { DateMenu } from '../entities/date-menu';
import { TransactionsMenu } from '../entities/transactions-menu';

export const FilterPanel = () => {
  return (
    <div className='border-y-uiMutedPrimary flex h-20 w-full items-center justify-center border border-x-0 bg-transparent p-4'>
      <div className='grid grid-cols-4 gap-3'>
        <TransactionsMenu />
        <DateMenu />
        <AssetsMenu />
        <div className='bg-uiSecondaryBg flex h-full w-full flex-row items-center justify-center gap-1 rounded-lg px-4 py-2'>
          <p className='text-uiPrimaryText'>clear</p>
          <IconX />
        </div>
      </div>
    </div>
  );
};
