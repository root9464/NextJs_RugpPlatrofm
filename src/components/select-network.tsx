'use client';

import Image from 'next/image';
import { Select } from './ui';

const ITEMS = [
  {
    id: 1,
    label: 'Item 1',
    title: 'TON',
    image_url: 'https://ton.org/icons/custom/ton_logo.svg',
  },
  {
    id: 2,
    label: 'Item 2',
    title: 'ETH',
    image_url: 'https://www.svgrepo.com/show/353715/ethereum.svg',
  },
];

export const SelectNetwork = () => (
  <Select aria-label='Select network' placeholder='Select a network' className='w-40' defaultSelectedKey={ITEMS[0].id} disabledKeys={[ITEMS[1].id]}>
    <Select.Trigger className='border-uiMutedPrimary bg-uiSecondaryBg border text-white' />
    <Select.List items={ITEMS} className='bg-uiSecondaryBg'>
      {(item) => (
        <Select.Option id={item.id} key={item.id} className='flex flex-row items-center'>
          <div className='flex flex-row items-center gap-2'>
            <Image src={item.image_url} alt={item.title} width={24} height={24} />
            {item.title}
          </div>
        </Select.Option>
      )}
    </Select.List>
  </Select>
);
