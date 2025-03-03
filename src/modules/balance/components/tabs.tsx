'use client';

import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';
import { Tabs } from '@components/ui';
import Image from 'next/image';
import { PieChartWidget } from '../widgets/pie-chart';
import { TokenTable } from '../widgets/token-table';
import { NFTsGrid } from './nfts-grid';

import TEST_BALANCE_DATA from '@/shared/tmp/balance.json';
import TEST_USER_NFT_DATA from '@/shared/tmp/nfts.json';
import { useParams } from 'next/navigation';

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

export const TabsAssets = () => {
  const params = useParams();
  console.log(params, 'address');

  return (
    <Tabs aria-label='Recipe App' defaultSelectedKey={ITEMS[0].id}>
      <Tabs.List className='gap-2.5 px-4 font-semibold text-white' items={ITEMS}>
        {(item) => <Tabs.Tab id={item.id}>{item.label}</Tabs.Tab>}
      </Tabs.List>

      <Tabs.Panel className='text-white' id='assets'>
        <div className='flex flex-col gap-3'>
          <PieChartWidget tokens={TEST_BALANCE_DATA ?? []} />
          <TokenTable />
        </div>
      </Tabs.Panel>

      <Tabs.Panel className='text-white' id='nfts'>
        <div className='bg-uiSecondaryBg flex min-h-[450px] flex-col gap-3 rounded-lg p-4'>
          <div className='flex h-fit w-full items-center gap-2'>
            <Image src={ScreenShotIco} alt='Screen Shot' width={20} height={20} />
            <Image src={OpenFullSizeIco} alt='Open Full Size' width={20} height={20} />
          </div>

          <NFTsGrid nfts={TEST_USER_NFT_DATA.nft_items ?? []} />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};
