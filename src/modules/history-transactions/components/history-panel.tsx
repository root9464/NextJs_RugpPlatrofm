import Image from 'next/image';

import CopyIco from '@assets/svg/copy.svg';
import AimIco from '@assets/svg/transactions-markers/aim.svg';
import ArrowDownIco from '@assets/svg/transactions-markers/arrow-down.svg';
import MouseIco from '@assets/svg/transactions-markers/mouse1.svg';
import VeryfyIco from '@assets/svg/transactions-markers/verify.svg';

export const HistoryPanel = () => {
  return (
    <div className='gird h-full w-full grid-rows-subgrid'>
      <TransactionRow />
      <TransactionRow />
      <TransactionRow />
      <TransactionRow />
      <TransactionRow />
    </div>
  );
};

const TransactionRow = () => {
  return (
    <div className='grid grid-cols-3 justify-between justify-items-stretch p-2.5'>
      <div className='flex flex-row items-center gap-2'>
        <Image src={ArrowDownIco} alt='Arrow Down' width={24} height={24} />
        <div className='flex h-full w-full flex-col justify-between'>
          <div className='flex flex-row items-center gap-1 text-white'>
            <p>UQDg...vhs_6</p>
            <Image src={CopyIco} alt='Magnifier' width={16} height={16} />
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Image src={MouseIco} alt='Mouse' width={18} height={18} />
            <Image src={AimIco} alt='Aim' width={18} height={18} />
            <Image src={VeryfyIco} alt='Veryfy' width={18} height={18} />
          </div>
        </div>
      </div>

      <div className='flex w-fit flex-col gap-1 justify-self-center text-white'>
        <h4 className='text-sm font-bold'>6 Aug, 19:43:12</h4>
        <p className='text-uiPrimaryText'>aaaaaaaaaaaaa...</p>
      </div>

      <div className='flex flex-col gap-1'>
        <h4 className='text-sm font-bold text-[#3BD464]'>6 Aug, 19:43:12</h4>
        <p className='text-uiPrimaryText'> $37.14</p>
      </div>
    </div>
  );
};
