'use client';

import { SearchField as SearchFieldPrimitive, type SearchFieldProps as SearchFieldPrimitiveProps, type ValidationResult } from 'react-aria-components';

import { Button } from './button';
import { Description, FieldError, FieldGroup, Input, Label } from './field';
import { Loader } from './loader';
import { composeTailwindRenderProps } from './primitive';

import MagnifierIco from '@assets/svg/magnifier.svg';
import SendIco from '@assets/svg/send-arrow.svg';
import Image from 'next/image';

interface SearchFieldProps extends SearchFieldPrimitiveProps {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  isPending?: boolean;
}

const SearchField = ({ className, placeholder, label, description, errorMessage, isPending, ...props }: SearchFieldProps) => {
  return (
    <SearchFieldPrimitive
      aria-label={placeholder ?? props['aria-label'] ?? 'Search...'}
      {...props}
      className={composeTailwindRenderProps(className, 'group/search-field flex flex-col gap-y-1')}>
      {!props.children ? (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup className='border-uiMutedPrimary bg-uiSecondaryBg border pl-2'>
            {isPending ? <Loader variant='spin' /> : <Image src={MagnifierIco} alt='Search' width={16} height={16} />}
            <Input placeholder={placeholder ?? 'Search...'} className='placeholder:text-uiSecondaryText' />

            <Button
              appearance='plain'
              className='text-muted-fg data-hovered:text-fg data-pressed:text-fg bg-uiMutedPrimary size-8 group-data-empty/search-field:invisible data-pressed:bg-transparent'>
              <Image src={SendIco} alt='Send' />
            </Button>
          </FieldGroup>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      ) : (
        props.children
      )}
    </SearchFieldPrimitive>
  );
};

export { SearchField };
export type { SearchFieldProps };
