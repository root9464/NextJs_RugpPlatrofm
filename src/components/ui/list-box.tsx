'use client';

import { IconCheck, IconHamburger } from 'justd-icons';
import type { ListBoxItemProps as ListBoxItemPrimitiveProps, ListBoxProps } from 'react-aria-components';
import { ListBoxItem as ListBoxItemPrimitive, ListBox as ListBoxPrimitive, composeRenderProps } from 'react-aria-components';

import { cn } from '@/shared/utils/classes';
import { DropdownItemDetails, DropdownLabel, DropdownSection, dropdownItemStyles } from './dropdown';

const ListBox = <T extends object>({ className, ...props }: ListBoxProps<T>) => (
  <ListBoxPrimitive
    {...props}
    className={composeRenderProps(className, (className) =>
      cn(
        [
          'flex max-h-96 w-full min-w-56 flex-col gap-y-1 overflow-y-auto rounded-xl p-1 shadow-lg outline-hidden [scrollbar-width:thin] [&::-webkit-scrollbar]:size-0.5',
          "grid grid-cols-[auto_1fr] overflow-auto *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1",
        ],
        className,
      ),
    )}
  />
);

interface ListBoxItemProps<T extends object> extends ListBoxItemPrimitiveProps<T> {
  className?: string;
}

const ListBoxItem = <T extends object>({ children, className, ...props }: ListBoxItemProps<T>) => {
  const textValue = typeof children === 'string' ? children : undefined;

  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({
          ...renderProps,
          className,
        }),
      )}>
      {({ allowsDragging, isSelected, isFocused, isDragging }) => (
        <>
          {allowsDragging && (
            <IconHamburger
              className={cn(
                'text-muted-fg size-4 shrink-0 transition',
                isFocused && 'text-fg',
                isDragging && 'text-fg',
                isSelected && 'text-accent-fg/70',
              )}
            />
          )}
          {isSelected && <IconCheck className='-mx-0.5 mr-2' data-slot='checked-icon' />}
          {typeof children === 'string' ? <DropdownLabel>{children}</DropdownLabel> : children}
        </>
      )}
    </ListBoxItemPrimitive>
  );
};

type ListBoxSectionProps = React.ComponentProps<typeof DropdownSection>;
const ListBoxSection = ({ className, ...props }: ListBoxSectionProps) => {
  return <DropdownSection className={cn(className, 'gap-y-1 [&_.lbi:last-child]:-mb-1.5')} {...props} />;
};

const ListBoxItemDetails = DropdownItemDetails;

ListBox.Section = ListBoxSection;
ListBox.ItemDetails = ListBoxItemDetails;
ListBox.Item = ListBoxItem;

export { ListBox };
export type { ListBoxItemProps, ListBoxSectionProps };
