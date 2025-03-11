'use client';

import SelectTokenIco from '@assets/svg/select-token.svg';
import { Card } from '@components/ui/card';
import { Chart, ChartConfig, ChartTooltip, ChartTooltipContent } from '@components/ui/chart';

import { generateColor } from '@shared/utils/utils';
import Image from 'next/image';
import { Pie, PieChart } from 'recharts';

import { useFullscreenModal } from '@/components/fullscreen-modal';
import { IndexatorModalLayouts } from '@/components/layouts/modal.layouts';
import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';
import { useParams } from 'next/navigation';
import { Jetton } from '../hooks/useUserBalance';
import { BalanceModule } from '../module';

export const PieChartWidget = ({ tokens }: { tokens: Jetton[] }) => {
  const chartData = tokens.map((token) => ({
    category: token.symbol,
    amount: token.balance,
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

  const {
    mount,
    unmount,
    modalState: { isOpen },
  } = useFullscreenModal();

  const { address } = useParams();

  return (
    <Card className='bg-uiSecondaryBg border-0 border-none text-white'>
      <Card.Header className='flex w-full flex-row items-center justify-between pb-0'>
        <div className='flex items-center gap-2'>
          <Image src={SelectTokenIco} alt='Select Token' width={20} height={20} />
          <h2 className='text-xl font-bold'>$xxxxx</h2>
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
                : (event) => mount(event, <IndexatorModalLayouts children_module={<BalanceModule address={address as string} />} />)
            }
          />
        </div>
      </Card.Header>
      <Card.Content className='flex-1 px-0 pb-0'>
        <Chart config={chartConfig} className='mx-auto aspect-square max-h-[250px] w-full'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className='bg-white' />} />
            <Pie data={chartData} dataKey='amount' nameKey='category' innerRadius={60} label minAngle={5} />
          </PieChart>
        </Chart>
      </Card.Content>
    </Card>
  );
};
