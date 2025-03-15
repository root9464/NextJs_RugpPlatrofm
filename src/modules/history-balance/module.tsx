'use client';

import { Card } from '@components/ui/card';
import Image from 'next/image';

import { useFullscreenModal } from '@/components/fullscreen-modal';
import { IndexatorModalLayouts } from '@/components/layouts/modal.layouts';

import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';

import { lazy } from 'react';
import { usePrice } from './hooks/useGetBalance';

const BalanceChart = lazy(() => import('./components/chart').then((module) => ({ default: module.BalanceChart })));

export const HistoryBalanceModule = ({ address }: { address: string }) => {
  const {
    mount,
    unmount,
    modalState: { isOpen },
  } = useFullscreenModal();

  const { data: prices, isSuccess, isLoading } = usePrice(address ?? '');

  return (
    <div className='flex h-max w-full flex-col gap-2.5'>
      <Card className='bg-uiSecondaryBg flex flex-col gap-5 border-0 border-none text-white'>
        <Card.Header className='flex w-full flex-row items-center justify-between pb-0'>
          <div className='flex items-center gap-2'>
            <h2 className='text-xl font-bold'>Balance History</h2>
            <p className='text-uiPrimaryText'>10 Mar, 2023 - 30 Dec. 2023</p>
          </div>
          <div className='flex items-center gap-2'>
            <Image src={ScreenShotIco} alt='Screen Shot' width={20} height={20} />
            <Image
              src={OpenFullSizeIco}
              alt='Open Full Size'
              width={20}
              height={20}
              onClick={
                isOpen
                  ? unmount
                  : (event) => mount(event, <IndexatorModalLayouts children_module={<HistoryBalanceModule address={address} />} />)
              }
            />
          </div>
        </Card.Header>
        <Card.Content className='z-0 border-none px-0'>
          {isSuccess && prices && <BalanceChart data={[prices]} />}
          {isLoading && <p>Loading...</p>}
        </Card.Content>
      </Card>
    </div>
  );
};
