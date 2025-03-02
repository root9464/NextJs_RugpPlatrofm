'use client';
import { useUserBalance } from '@/modules/balance/hooks/useUserBalance';
import { TonConnectButton } from '@tonconnect/ui-react';
import { IconBell } from 'justd-icons';
import { SelectNetwork } from './select-network';
import { SearchField } from './ui';

export const Topbar = () => {
  const { mutate: SearchWallet, data } = useUserBalance();
  console.log(data);

  return (
    <div className='bg-uiPrimaryBg fixed top-0 right-0 z-1 flex h-20 w-[calc(100%-72px)] items-center justify-between px-[50px] py-4'>
      <div className='flex w-max flex-row items-center gap-2'>
        <SearchField aria-label='Search' placeholder='Search' onSubmit={SearchWallet} />
        <SelectNetwork />
      </div>

      <div className='flex w-max flex-row items-center gap-2'>
        <IconBell className='h-6 w-6' />
        <TonConnectButton />
      </div>
    </div>
  );
};
