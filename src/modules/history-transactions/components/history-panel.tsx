import Image from 'next/image';

import { CopyClipboard } from '@/components/features/copy-clipboard';
import { getAmount, getFirstComment, getTransactionDirection } from '@/modules/history-transactions/utils/utils';
import { formatUnixTime } from '@/shared/utils/utils';
import { Address } from '@ton/core';
import { Event } from '../hooks/useGetTrHistory';

import AimIco from '@assets/svg/transactions-markers/aim.svg';
import ArrowDownIco from '@assets/svg/transactions-markers/arrow-down.svg';
import ArrowUpIco from '@assets/svg/transactions-markers/arrow-up.svg';
import MouseIco from '@assets/svg/transactions-markers/mouse1.svg';
import VeryfyIco from '@assets/svg/transactions-markers/verify.svg';

export const HistoryPanel = ({ transactions }: { transactions: Event[] }) => (
  <div className='gird max-h-[700px] w-full grid-rows-subgrid overflow-y-scroll p-4'>
    {transactions.map(({ account, timestamp, actions }, index) => {
      const isIncoming = getTransactionDirection(actions[0], account.address);
      const address = Address.parse(account.address).toString();
      const jetton = getAmount(actions);
      if (jetton.amount === '0' && jetton.symbol === 'unknown') return null;

      return (
        <div className='grid grid-cols-3 justify-between justify-items-stretch p-2.5' key={index}>
          <div className='flex flex-row items-center gap-2'>
            <Image src={isIncoming ? ArrowUpIco : ArrowDownIco} alt='Arrow Down' width={24} height={24} />
            <div className='flex h-full w-full flex-col justify-between'>
              <CopyClipboard data={`${address.slice(0, 5)}...${address.slice(-5)}`} />
              <div className='flex flex-row items-center gap-1'>
                <Image src={MouseIco} alt='Mouse' width={18} height={18} />
                <Image src={AimIco} alt='Aim' width={18} height={18} />
                <Image src={VeryfyIco} alt='Veryfy' width={18} height={18} />
              </div>
            </div>
          </div>

          <div className='flex w-fit flex-col gap-1 justify-self-center text-white'>
            <h4 className='text-sm font-bold'>{formatUnixTime(timestamp)}</h4>
            <p className='text-uiPrimaryText max-w-[107px] cursor-grab overflow-x-auto whitespace-nowrap'>{getFirstComment(actions)}</p>
          </div>

          <div className='flex flex-col gap-1'>
            <h4 className={`text-sm font-bold ${isIncoming ? 'text-[#d43b3b]' : 'text-[#3BD464]'}`}>{`${jetton.amount} ${jetton.symbol}`}</h4>
            <p className='text-uiPrimaryText'> $0</p>
          </div>
        </div>
      );
    })}
  </div>
);
