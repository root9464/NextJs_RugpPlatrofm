'use client';

import { Tabs } from '@components/ui';
import { PieChartWidget } from '../widgets/pie-chart';

import TEST_BALANCE_DATA from '@/shared/tmp/balance.json';

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
  return (
    <Tabs aria-label='Recipe App' defaultSelectedKey={ITEMS[0].id}>
      <Tabs.List className='gap-2.5 px-4 font-semibold text-white' items={ITEMS}>
        {(item) => <Tabs.Tab id={item.id}>{item.label}</Tabs.Tab>}
      </Tabs.List>

      <NftTabsPanel />
    </Tabs>
  );
};

const NftTabsPanel = () => {
  return (
    <Tabs.Panel className='text-white' id='nfts'>
      <PieChartWidget tokens={TEST_BALANCE_DATA ?? []} />
    </Tabs.Panel>
  );
};
