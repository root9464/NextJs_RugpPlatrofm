/* eslint-disable @next/next/no-img-element */
'use client';

import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';
import { Tabs } from '@components/ui/tabs';
import Image from 'next/image';
import { usePrice } from '../history-balance/hooks/useGetBalance';
import { PieChartWidget } from './components/pie-chart';
import { useUserBalance } from './hooks/useUserBalance';
import { useUserNft } from './hooks/useUserNft';
import { TokenTable } from './slices/token-table';
import { mapBalancesToTable } from './utils/utils';

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
  const { data: user_nfts, isSuccess: isSuccessNfts, isLoading: isLoadingNfts, isError: isErrorNfts, error: errorNfts } = useUserNft(address);
  const { data: user_balance } = useUserBalance(address);
  const { data: prices } = usePrice(address ?? ''); // тут где то баг

  const tokenTableData = mapBalancesToTable(user_balance ?? [], prices?.jettonsPrices ?? []);

  return (
    <div className='h-fit w-full'>
      <Tabs aria-label='Recipe App' defaultSelectedKey={ITEMS[0].id}>
        <Tabs.List className='gap-2.5 px-4 font-semibold text-white' items={ITEMS}>
          {(item) => <Tabs.Tab id={item.id}>{item.label}</Tabs.Tab>}
        </Tabs.List>

        <Tabs.Panel className='min-h-[486px] text-white' id='assets'>
          <div className='flex flex-col gap-3'>
            <PieChartWidget tokens={user_balance ?? []} balanceInUsd={prices?.balanceInUsd ?? 0} />

            <TokenTable data={tokenTableData} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel className='min-h-[486px] text-white' id='nfts'>
          <div className='bg-uiSecondaryBg flex min-h-[486px] flex-1 flex-col gap-3 rounded-lg p-4'>
            <div className='flex h-fit w-full items-center gap-2'>
              <Image src={ScreenShotIco} alt='Screen Shot' width={20} height={20} />
              <Image src={OpenFullSizeIco} alt='Open Full Size' width={20} height={20} />
            </div>
            <div className='grid w-full flex-1 grid-cols-[1fr_1fr] gap-3'>
              {isSuccessNfts &&
                user_nfts?.map((nft) => (
                  <img src={nft.metadata.image.sizes.medium} alt={nft.metadata.name} key={nft.metadata.name} className='w-full' />
                ))}

              {isLoadingNfts && <div>Loading...</div>}

              {isErrorNfts && <div>{errorNfts.message}</div>}
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
