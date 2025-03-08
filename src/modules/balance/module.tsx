'use client';

import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';
import { Tabs } from '@components/ui/tabs';
import Image from 'next/image';
import { PieChartWidget } from './widgets/pie-chart';
import { TokenTable } from './widgets/token-table';

import { NFTsGrid } from './components/nfts-grid';
import { useUserBalance } from './hooks/useUserBalance';
import { useUserNft } from './hooks/useUserNft';

const ITEMS = [
  {
    id: 'assets',
    label: 'Assets',
  },
  {
    id: 'nfts',
    label: 'NFTs',
  },
];

export const BalanceModule = ({ address }: { address: string }) => {
  const { data: nfts } = useUserNft(address);
  const { data: user_balance } = useUserBalance(address);

  return (
    <div className='h-full w-full'>
      <Tabs aria-label='Recipe App' defaultSelectedKey={ITEMS[0].id}>
        <Tabs.List className='gap-2.5 px-4 font-semibold text-white' items={ITEMS}>
          {(item) => <Tabs.Tab id={item.id}>{item.label}</Tabs.Tab>}
        </Tabs.List>

        <Tabs.Panel className='min-h-[486px] text-white' id='assets'>
          <div className='flex flex-col gap-3'>
            <PieChartWidget tokens={user_balance ?? []} />
            <TokenTable />
          </div>
        </Tabs.Panel>

        <Tabs.Panel className='min-h-[486px] text-white' id='nfts'>
          <div className='bg-uiSecondaryBg flex min-h-[486px] flex-1 flex-col gap-3 rounded-lg p-4'>
            <div className='flex h-fit w-full items-center gap-2'>
              <Image src={ScreenShotIco} alt='Screen Shot' width={20} height={20} />
              <Image src={OpenFullSizeIco} alt='Open Full Size' width={20} height={20} />
            </div>

            <NFTsGrid nfts={nfts ?? []} />
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
