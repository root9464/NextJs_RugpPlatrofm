'use client';
import { copyClipboard } from '@/shared/utils/utils';
import CopyIco from '@assets/svg/copy.svg';
import Image from 'next/image';
import { toast } from 'sonner';

export const CopyClipboard = ({ data }: { data: string }) => (
  <div className='flex cursor-pointer flex-row items-center gap-1 text-white'>
    <p>{data}</p>
    <Image
      src={CopyIco}
      alt='Magnifier'
      width={16}
      height={16}
      onClick={() => {
        copyClipboard(data);
        toast.success('Copy address to clipboard', {
          description: 'Jetton minted successfully',
          position: 'bottom-right',
          unstyled: true,
          classNames: {
            toast: 'bg-uiSecondaryBg rounded-lg px-3 py-2 w-[200px] shadow-lg flex flex-row items-center gap-2',
            title: 'text-white text-sm',
            description: 'text-uiPrimaryText text-xs',
          },
        });
      }}
    />
  </div>
);
