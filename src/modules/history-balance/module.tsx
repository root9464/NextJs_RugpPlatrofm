'use client';

import { Card, Chart, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@components/ui';
import Image from 'next/image';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'; // Import ReferenceLine

import { useFullscreenModal } from '@/components/fullscreen-modal';
import { IndexatorModalLayouts } from '@/components/layouts/modal.layouts';
import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';

const generateDateRange = (startDate: Date, endDate: Date) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push({
      month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
      revenue: 1000, // динамическое значение
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return dates;
};

const startDate = new Date(2023, 2, 10); // 10 марта 2023 (месяцы начинаются с 0)
const endDate = new Date(2023, 11, 30); // 30 декабря 2023
const salesData = generateDateRange(startDate, endDate);

const salesConfig = {
  revenue: {
    label: 'Balance value',
    color: '#0D99FF',
  },
} satisfies ChartConfig;

export const HistoryBalanceModule = () => {
  const {
    mount,
    unmount,
    modalState: { isOpen },
  } = useFullscreenModal();

  return (
    <div className='flex h-full w-full flex-col gap-2.5'>
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
              onClick={isOpen ? unmount : (event) => mount(event, <IndexatorModalLayouts children_module={<HistoryBalanceModule />} />)}
            />
          </div>
        </Card.Header>
        <Card.Content className='px-0'>
          <Chart className='max-h-[250px] w-full text-white' config={salesConfig}>
            <AreaChart
              accessibilityLayer
              data={salesData}
              className='text-white'
              margin={{
                left: 12,
                right: 12,
              }}>
              <CartesianGrid vertical={false} stroke='var(--uiMutedPrimary)' />
              <YAxis
                tick={{ stroke: 'var(--uiPrimaryText)', strokeWidth: 0.5 }}
                stroke='var(--uiPrimaryText)'
                tickLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                ticks={[1000, 2000, 3000, 4000, 5000]}
              />
              <XAxis
                tick={{ stroke: 'var(--uiPrimaryText)', strokeWidth: 0.5 }}
                dataKey='month'
                stroke='var(--uiPrimaryText)'
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' className='bg-white' />} />
              <defs>
                <linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='var(--color-revenue)' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='var(--color-revenue)' stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area dataKey='revenue' type='natural' fill='url(#fillRevenue)' fillOpacity={0.4} stroke='var(--color-revenue)' />
            </AreaChart>
          </Chart>
        </Card.Content>
      </Card>
    </div>
  );
};
