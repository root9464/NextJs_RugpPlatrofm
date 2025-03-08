'use client';

import { useState } from 'react';

import { Menu } from '@/components/ui/menu';
import type { Placement } from '@react-types/overlays';
import type { Selection } from 'react-aria-components';

export const placements = ['coin1', 'coin2', 'coin3', 'coin4', 'coin5'].map((item, i) => ({ id: i, name: item }));

export const AssetsMenu = () => {
  const [selected, setSelected] = useState<Selection>(new Set(['bottom']));
  return (
    <Menu>
      <Menu.Trigger className='h-fit w-max'>
        <div className='bg-uiSecondaryBg h-14 w-[120px] rounded-lg px-4 py-2'>
          <p className='text-uiPrimaryText text-xs'>Assets</p>
          <p className='text-base text-white'>All</p>
        </div>
      </Menu.Trigger>
      <Menu.Content
        placement={Array.from(selected)[0] as Placement}
        selectionMode='single'
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={placements}
        className='bg-uiSecondaryBg max-h-72 min-w-52'>
        {(item) => (
          <Menu.Item id={item.name} className='text-white **:text-white'>
            <Menu.Label>{item.name}</Menu.Label>
          </Menu.Item>
        )}
      </Menu.Content>
    </Menu>
  );
};
