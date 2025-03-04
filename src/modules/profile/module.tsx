'use client';

import { Tabs } from '@/components/ui';
import { ProfileCard } from './components/profile-card';
import { ProfileDescription } from './components/profile-desc';

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
export const ProfileModule = () => {
  return (
    <div className='flex h-full w-full flex-col gap-2.5'>
      <Tabs aria-label='Recipe App' defaultSelectedKey={ITEMS[0].id}>
        <Tabs.List className='gap-2.5 px-4 font-semibold text-white' items={ITEMS}>
          {(item) => <Tabs.Tab id={item.id}>{item.label}</Tabs.Tab>}
        </Tabs.List>

        <Tabs.Panel className='text-white' id='telegram'>
          <div className='flex flex-col gap-3'>
            <ProfileCard />
            <ProfileDescription />
          </div>
        </Tabs.Panel>

        <Tabs.Panel className='text-white' id='x'>
          X.com
        </Tabs.Panel>
        <Tabs.Panel className='text-white' id='discord'>
          Discord
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
