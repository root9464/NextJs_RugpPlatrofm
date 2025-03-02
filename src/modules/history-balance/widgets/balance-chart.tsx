'use client';

import { Card, Chart, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@components/ui';
import Image from 'next/image';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';

const generateDateRange = (startDate: Date, endDate: Date) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push({
      month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
      revenue: Math.floor(Math.random() * 5000 + 2000),
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return dates;
};

// Определяем даты
const startDate = new Date(2023, 2, 10); // 10 марта 2023 (месяцы начинаются с 0)
const endDate = new Date(2023, 11, 30); // 30 декабря 2023
const salesData = generateDateRange(startDate, endDate);

const salesConfig = {
  revenue: {
    label: 'Balance value',
    color: '#0D99FF',
  },
} satisfies ChartConfig;

export const BalanceChartWidget = () => {
  return (
    <Card className='bg-uiSecondaryBg flex flex-col gap-5 border-0 border-none text-white'>
      <Card.Header className='flex w-full flex-row items-center justify-between pb-0'>
        <div className='flex items-center gap-2'>
          <h2 className='text-xl font-bold'>Balance History</h2>
          <p className='text-uiPrimaryText'>10 Mar, 2023 - 30 Dec. 2023</p>
        </div>
        <div className='flex items-center gap-2'>
          <Image src={ScreenShotIco} alt='Screen Shot' width={20} height={20} />
          <Image src={OpenFullSizeIco} alt='Open Full Size' width={20} height={20} />
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
            <CartesianGrid vertical={false} />

            <YAxis
              tick={{ stroke: 'var(--uiPrimaryText)', strokeWidth: 0.5 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              ticks={[1000, 2000, 3000, 4000, 5000]}
            />
            <XAxis
              tick={{ stroke: 'var(--uiPrimaryText)', strokeWidth: 0.5 }}
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' className='bg-white' />} />
            <Area dataKey='revenue' type='natural' fill='var(--color-revenue)' fillOpacity={0.4} stroke='var(--color-revenue)' />
          </AreaChart>
        </Chart>
      </Card.Content>
    </Card>
  );
};
