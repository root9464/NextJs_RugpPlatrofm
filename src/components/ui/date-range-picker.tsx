'use client';

import {
  DateRangePicker as DateRangePickerPrimitive,
  type DateRangePickerProps as DateRangePickerPrimitiveProps,
  type DateValue,
  type ValidationResult,
} from 'react-aria-components';

import type { DateDuration } from '@internationalized/date';
import type { Placement } from '@react-types/overlays';
import { DateInput } from './date-field';
import { DatePickerOverlay } from './date-picker';
import { Description, FieldError, FieldGroup, Label } from './field';
import { composeTailwindRenderProps } from './primitive';

import CalendarIco from '@assets/svg/calendar.svg';
import Image from 'next/image';

interface DateRangePickerProps<T extends DateValue> extends DateRangePickerPrimitiveProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  visibleDuration?: DateDuration;
  pageBehavior?: 'visible' | 'single';
  contentPlacement?: Placement;
}

const DateRangePicker = <T extends DateValue>({
  label,
  className,
  description,
  errorMessage,
  contentPlacement = 'bottom',
  visibleDuration = { months: 1 },
  ...props
}: DateRangePickerProps<T>) => {
  return (
    <DateRangePickerPrimitive {...props} className={composeTailwindRenderProps(className, 'group/date-range-picker flex flex-col gap-y-1')}>
      {label && <Label className='text-white'>{label}</Label>}
      <FieldGroup className='border-uiMutedPrimary bg-uiSecondaryBg w-max min-w-40'>
        <DateInput slot='start' className='w-[140px]' />
        <span
          aria-hidden='true'
          className='text-fg group-data-disabled:text-muted-fg forced-colors:text-[ButtonText] forced-colors:group-data-disabled:text-[GrayText]'>
          –
        </span>
        <DateInput className='w-[140px] pr-8' slot='end' />
        <div className='mr-1 h-7 w-8 rounded bg-transparent outline-offset-0'>
          <Image src={CalendarIco} alt='calendar' className='h-full w-full' />
        </div>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerOverlay placement={contentPlacement} visibleDuration={visibleDuration} range />
    </DateRangePickerPrimitive>
  );
};
export { DateRangePicker };
export type { DateRangePickerProps };
