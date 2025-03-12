'use client';

import { Card } from '@components/ui/card';
import Image from 'next/image';

import { useFullscreenModal } from '@/components/fullscreen-modal';
import { IndexatorModalLayouts } from '@/components/layouts/modal.layouts';
import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';

import { useQueryClient } from '@tanstack/react-query';
import {
  AreaSeries,
  AreaStyleOptions,
  ChartOptions,
  ColorType,
  createChart,
  CrosshairMode,
  DeepPartial,
  LineStyle,
  LineType,
  SeriesOptionsCommon,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { useGetBalance } from './hooks/useGetBalance';

const chartAreaStyle: DeepPartial<ChartOptions> = {
  layout: {
    background: { type: ColorType.Solid, color: '#090c14' },
    textColor: '#414a60',
    attributionLogo: false,
  },
  grid: {
    vertLines: { color: 'transparent' },
    horzLines: { color: '#121B2E' },
  },
  crosshair: {
    horzLine: { color: 'white', style: LineStyle.Dashed },
    vertLine: { color: 'white', style: LineStyle.Dashed },
    mode: CrosshairMode.Magnet,
  },
};

const chartAreaSeriesStyle: DeepPartial<AreaStyleOptions & SeriesOptionsCommon> = {
  lineColor: 'rgba(21,93,252,0.95)',
  topColor: 'rgba(21,93,252,0.95)',
  bottomColor: 'rgba(21, 93, 252, 0.05)',
  priceLineColor: 'rgba(21,93,252,0.5)',
  priceLineStyle: LineStyle.Dotted,
  lineType: LineType.Curved,
};

export const HistoryBalanceModule = ({ address }: { address: string }) => {
  const {
    mount,
    unmount,
    modalState: { isOpen },
  } = useFullscreenModal();
  const queryClient = useQueryClient();

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const { data: addressBalance, isSuccess } = useGetBalance(address);
  if (isSuccess) {
    queryClient.setQueryData(['balance-history', address], (oldData: { time: string; value: number }[] | undefined) => {
      if (!oldData) return [addressBalance];

      if (oldData[oldData.length - 1].value === addressBalance.value) return oldData;
      return [...oldData, addressBalance];
    });
  }

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current as HTMLDivElement, {
      ...chartAreaStyle,
      width: chartContainerRef.current?.clientWidth,
      height: 300,
    });

    chart.timeScale().fitContent();
    const newSeries = chart.addSeries(AreaSeries, chartAreaSeriesStyle);
    const historyData = queryClient.getQueryData<{ time: string; value: number }[]>(['balance-history', address]) ?? [];
    newSeries.setData(historyData);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [chartContainerRef, addressBalance, address, queryClient]);

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
          <div ref={chartContainerRef} className='h-full w-full' />
        </Card.Content>
      </Card>
    </div>
  );
};
