'use client';
import { Menu } from '@/components/ui/menu';
import { useState } from 'react';
import { Selection } from 'react-aria-components';

const items = [
  {
    id: 1,
    name: 'Transaction type',
    landmarks: [
      { id: 101, name: 'transfer im' },
      { id: 102, name: 'transfer out' },
      { id: 103, name: 'swap' },
    ],
  },
  {
    id: 2,
    name: 'Transaction marker',
    landmarks: [
      { id: 201, name: 'scam' },
      { id: 202, name: 'sniper' },
      { id: 203, name: 'whale' },
    ],
  },
];

export const TransactionsMenu = () => {
  const [selected, setSelected] = useState<Selection>(new Set(['autoPlay']));

  return (
    <Menu>
      <Menu.Trigger className='h-fit w-full'>
        <div className='bg-uiSecondaryBg h-14 rounded-lg px-4 py-2'>
          <p className='text-uiPrimaryText text-xs'>Transaction</p>
          <p className='text-base text-white'>All</p>
        </div>
      </Menu.Trigger>
      <Menu.Content
        placement='bottom'
        selectionMode='multiple'
        selectedKeys={selected}
        onSelectionChange={(e) => setSelected(e)}
        items={items}
        className='bg-uiSecondaryBg w-[250px]'>
        {(item) => (
          <Menu.Section title={item.name} items={item.landmarks} className='*:text-uiPrimaryText'>
            {(landmark) => (
              <Menu.Item textValue={landmark.name} className='text-white **:text-white'>
                <Menu.Label>{landmark.name}</Menu.Label>
              </Menu.Item>
            )}
          </Menu.Section>
        )}
      </Menu.Content>
    </Menu>
  );
};
