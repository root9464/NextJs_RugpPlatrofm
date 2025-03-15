import { CopyClipboard } from '@/components/features/copy-clipboard';
import { shortedAddress } from '@/shared/utils/utils';
import Magnifier from '@assets/svg/magnifier.svg';
import Image from 'next/image';

type HistoryTransactionsHeaderProps = {
  name: string;
  address: string;
  createdAt: string;
};

export const HistoryTransactionsHeader = ({ name, address, createdAt }: HistoryTransactionsHeaderProps) => {
  return (
    <div className='grid h-fit w-full grid-cols-subgrid gap-2 p-4 text-white'>
      <div className='flex h-fit flex-row items-center gap-2'>
        <h3>Name:</h3>
        <p>{name}</p>
      </div>

      <div className='flex h-fit flex-row items-center gap-2'>
        <h3>Address</h3>
        <CopyClipboard data={shortedAddress(address)} className='text-uiPrimaryText' />
      </div>

      <div className='flex h-fit flex-row items-center gap-2'>
        <h3>Created at:</h3>
        <p className='text-uiPrimaryText flex flex-row items-center gap-1'>
          {createdAt}
          <Image src={Magnifier} alt='Magnifier' width={16} height={16} />
        </p>
      </div>
    </div>
  );
};
