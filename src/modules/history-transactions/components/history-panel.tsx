import Image from 'next/image';

import { CopyClipboard } from '@/components/features/copy-clipboard';

import { formatUnixTime } from '@/shared/utils/utils';
import AimIco from '@assets/svg/transactions-markers/aim.svg';
import ArrowDownIco from '@assets/svg/transactions-markers/arrow-down.svg';
import ArrowUpIco from '@assets/svg/transactions-markers/arrow-up.svg';
import MouseIco from '@assets/svg/transactions-markers/mouse1.svg';
import VeryfyIco from '@assets/svg/transactions-markers/verify.svg';
import { Address } from '@ton/core';
import { SerializedTransaction } from '../helpers/helpers';

export const HistoryPanel = ({ transactions, address }: { transactions: SerializedTransaction[]; address: string }) => {
  return (
    <div className='gird max-h-[700px] w-full grid-rows-subgrid gap-4 overflow-y-scroll p-4'>
      {transactions.map(({ comment, from, to, token, amount, timestamp }, index) => {
        const direction = from === Address.parse(address).toString({ bounceable: false }) ? 'incoming' : 'outgoing';
        if (!from || !to) return null;

        return (
          <div className='grid grid-cols-[150px_115px_auto] justify-items-stretch gap-3 p-2.5' key={index}>
            <div className='flex flex-row items-center gap-2'>
              <Image src={direction === 'outgoing' ? ArrowDownIco : ArrowUpIco} alt='Arrow Down' width={24} height={24} />
              <div className='flex h-full w-full flex-col justify-between'>
                <CopyClipboard
                  className='justify-between'
                  data={direction === 'outgoing' ? `${from.slice(0, 4)}...${from.slice(-4)}` : `${to.slice(0, 4)}...${to.slice(-4)}`}
                />
                <div className='flex flex-row items-center gap-1'>
                  <Image src={MouseIco} alt='Mouse' width={18} height={18} />
                  <Image src={AimIco} alt='Aim' width={18} height={18} />
                  <Image src={VeryfyIco} alt='Veryfy' width={18} height={18} />
                </div>
              </div>
            </div>

            <div className='flex w-full flex-col gap-1 justify-self-center text-white'>
              <p className='text-sm font-bold'>{formatUnixTime(timestamp)}</p>
              <p className='text-uiPrimaryText max-w-[107px] cursor-grab overflow-x-auto whitespace-nowrap'>{comment ?? 'No comment'}</p>
            </div>

            <div className='flex w-fit flex-col gap-1'>
              <h4
                className={`text-sm font-bold ${direction === 'incoming' ? 'text-[#d43b3b]' : 'text-[#3BD464]'}`}>{`${amount} ${token?.symbol ?? 'TON'}`}</h4>
              <p className='text-uiPrimaryText'> $0</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
