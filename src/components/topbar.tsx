'use client';
import { TonConnectButton } from '@tonconnect/ui-react';
import { IconBell } from 'justd-icons';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { SearchInput } from './search-input';
import { SelectNetwork } from './select-network';

const searchInputSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1, { message: 'Field is required' })
    .max(48, { message: 'Maximum length is 48 characters' })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message: 'Only letters, numbers, hyphens and underscores are allowed',
    })
    .transform((val) => val.trim()),
});

export const Topbar = () => {
  const router = useRouter();
  const searchSubmit = async (search: string) => router.push(`/indexator/${search}`);

  return (
    <div className='bg-uiPrimaryBg fixed top-0 right-0 z-[2] flex h-20 w-[calc(100%-72px)] items-center justify-between px-[50px] py-4'>
      <div className='flex w-max flex-row items-center gap-2'>
        <SearchInput placeholder='Search...' func={searchSubmit} schema={searchInputSchema} className='w-[200px]' />
        <SelectNetwork />
      </div>

      <div className='flex w-max flex-row items-center gap-2'>
        <IconBell className='h-6 w-6' />
        <TonConnectButton />
      </div>
    </div>
  );
};
