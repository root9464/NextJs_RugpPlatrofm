import Image from 'next/image';

import CopyIco from '@assets/svg/copy.svg';
import Link from 'next/link';

export const ProfileDescription = () => {
  return (
    <div className='bg-uiSecondaryBg flex w-full flex-col gap-2.5 rounded-lg p-4'>
      <p>
        Description: <span className='text-uiPrimaryText'>some account description</span>
      </p>
      <div className='flex flex-row items-center'>
        <p>ID:</p>
        <div className='flex flex-row items-center gap-1'>
          <p className='text-uiPrimaryText'>3333333333333</p>
          <Image src={CopyIco} alt='copy' width={14} height={14} />
        </div>
      </div>

      <Link href='#' className='text-[#0D99FF] underline'>
        @tgchannelname
      </Link>
    </div>
  );
};
