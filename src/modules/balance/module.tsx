'use client';

import { NFTsGrid } from './components/nfts-grid';
import { BalanceTabs } from './components/tabs';
import { TokenTable } from './widgets/token-table';

export const BalanceModule = ({ address }: { address: string }) => {
  return (
    <div className='h-full w-full'>
      <BalanceTabs address={address} TokenTable={TokenTable} NftsGrid={NFTsGrid} />
    </div>
  );
};
