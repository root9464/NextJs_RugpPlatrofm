import { copyClipboard } from '@/shared/utils/utils';
import CopyContentIcon from '@assets/svg/copy.svg';
import Magnifier from '@assets/svg/magnifier.svg';
import Image from 'next/image';
import { toast } from 'sonner';

export const HistoryTransactionsHeader = () => {
  return (
    <div className='grid h-fit w-full grid-cols-subgrid gap-2 p-4 text-white'>
      <div className='flex h-fit flex-row items-center gap-2'>
        <h3>Name:</h3>
        <p>hotdog-off-lab.ton</p>
      </div>

      <AddressRow />

      <div className='flex h-fit flex-row items-center gap-2'>
        <h3>Name:</h3>
        <p>hotdog-off-lab.ton</p>
      </div>

      <div className='flex h-fit flex-row items-center gap-2'>
        <h3>Created at:</h3>
        <p className='flex flex-row items-center gap-1'>
          1 Sep, 20:43:21
          <Image src={Magnifier} alt='Magnifier' width={16} height={16} />
        </p>
      </div>
    </div>
  );
};

const AddressRow = () => (
  <div className='flex h-fit flex-row items-center gap-2'>
    <h3>Address</h3>
    <div className='flex flex-row items-center gap-1'>
      <p className='text-uiPrimaryText text-xs'>UQAo4yAItsih-hVOOhOb2f3Jcj8yp09hdIzuLXuVfSNNzuku</p>
      <button
        className='cursor-pointer bg-transparent'
        onClick={() => {
          copyClipboard('UQAo4yAItsih-hVOOhOb2f3Jcj8yp09hdIzuLXuVfSNNzuku');
          toast.success('Copy address to clipboard', {
            description: 'Jetton minted successfully',
            position: 'bottom-right',
            unstyled: true,
            classNames: {
              toast: 'bg-uiSecondaryBg text-gray-500 rounded-[6px] px-3 py-2 w-[300px] shadow-lg',
              title: 'text-[#231F20]',
            },
          });
        }}>
        <Image src={CopyContentIcon} alt='Copy content' width={16} height={16} />
      </button>
    </div>
  </div>
);
