'use client';
import { useWindow } from '@/shared/hooks/useWindow';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { PriceResponse } from '../history-balance/hooks/useGetBalance';
import { Timeline } from './components/timeline';
import { histogramData } from './constants/const';

const widthSizeRanges = [
  { minWidth: 1600, widthSize: 1290 },
  { minWidth: 1400, widthSize: 1000 },
  { minWidth: 1200, widthSize: 930 },
  { minWidth: 992, widthSize: 600 },
  { minWidth: 768, widthSize: 400 },
  { minWidth: 0, widthSize: 300 },
];

function getWidthSize(minWidth: number) {
  const widthSizeRange = widthSizeRanges.find((range) => range.minWidth <= minWidth) ?? widthSizeRanges[widthSizeRanges.length - 1];
  return widthSizeRange.widthSize;
}

export const TimeLineModule = () => {
  const { width } = useWindow();
  const widthSize = getWidthSize(width);
  const { address } = useParams();

  const queryClient = useQueryClient();

  const cachePriceJettons: { balanceInUsd: number; jettonsPrices: PriceResponse[] } | undefined = queryClient.getQueryData([
    'price-jettons',
    address ?? '',
  ]);

  return <Timeline widthSize={widthSize} markers={histogramData} offset={16} />;
};
