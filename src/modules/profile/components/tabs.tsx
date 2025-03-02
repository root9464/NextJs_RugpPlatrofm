'use client';

import { Tabs } from '@/components/ui';
import { ProfileCard } from './profile-card';
import { ProfileDescription } from './profile-desc';

const ITEMS = [
  {
    id: 'telegram',
    label: 'Telegram',
  },
  {
    id: 'x',
    label: 'X.com',
  },
  {
    id: 'discord',
    label: 'Discord',
  },
];

export const ProfileTabs = () => {
  return (
    <Tabs aria-label='Recipe App' defaultSelectedKey={ITEMS[0].id}>
      <Tabs.List className='gap-2.5 px-4 font-semibold text-white' items={ITEMS}>
        {(item) => <Tabs.Tab id={item.id}>{item.label}</Tabs.Tab>}
      </Tabs.List>

      <TelegramTabPanel />

      <Tabs.Panel className='text-white' id='x'>
        X.com
      </Tabs.Panel>
      <Tabs.Panel className='text-white' id='discord'>
        Discord
      </Tabs.Panel>
    </Tabs>
  );
};

const TelegramTabPanel = () => {
  return (
    <Tabs.Panel className='text-white' id='telegram'>
      <div className='flex flex-col gap-3'>
        <ProfileCard />
        <ProfileDescription />
      </div>
    </Tabs.Panel>
  );
};
