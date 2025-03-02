'use client';

import { Card, Chart, ChartConfig, ChartTooltip, ChartTooltipContent } from '@components/ui';
import { generateColor } from '@shared/utils/utils';
import { Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

type Token = {
  balance: number;
  image: string;
  symbol: string;
  decimals: number;
  address: string;
};

type PieChartWidgetProps = {
  tokens: Token[];
};

export const PieChartWidget = ({ tokens }: PieChartWidgetProps) => {
  const chartData = tokens.map((token) => ({
    category: token.symbol,
    sales: token.balance,
    fill: generateColor(),
  }));

  const chartConfig = tokens.reduce<ChartConfig>(
    (config, token) => {
      config[token.symbol.toLowerCase()] = {
        label: token.symbol,
        color: generateColor(),
      };
      return config;
    },
    { balance: { label: 'Balance' } },
  ) satisfies ChartConfig;

  return (
    <Card>
      <Card.Header className='items-center pb-0' title='Token Balance Distribution' description='Current Portfolio Allocation' />
      <Card.Content className='flex-1 pb-0'>
        <Chart config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey='sales'
              nameKey='category'
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => <Sector {...props} outerRadius={outerRadius + 10} />}
            />
          </PieChart>
        </Chart>
      </Card.Content>
    </Card>
  );
};
