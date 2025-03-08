'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Popover } from '@/components/ui/popover';

export const DateMenu = () => {
  return (
    <Popover>
      <Popover.Trigger className='h-fit w-max outline-none'>
        <div className='bg-uiSecondaryBg h-14 w-[120px] rounded-lg px-4 py-2 text-start'>
          <p className='text-uiPrimaryText text-xs'>Date/Memo</p>
          <p className='text-base text-white'>All</p>
        </div>
      </Popover.Trigger>
      <Popover.Content className='bg-uiSecondaryBg'>
        <Popover.Header className='h-min p-0 px-4 sm:p-0 sm:px-4'>
          <Popover.Title className='text-base text-white'>Select a date</Popover.Title>
          <Popover.Description className='text-uiPrimaryText'>We'll send you an email to log in.</Popover.Description>
        </Popover.Header>
        <Popover.Body className='grid h-20 flex-none grid-rows-subgrid content-center space-y-2'>
          <DateRangePicker className='mb-2 w-full' />
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
