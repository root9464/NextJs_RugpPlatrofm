import { cn } from '@/shared/utils/classes';
import { FC, ReactNode } from 'react';

export const PageLayout: FC<{ children: Readonly<ReactNode>; className?: string }> = ({ children, className }) => {
  return (
    <div className='absolute top-20 right-0 min-h-[calc(100%-80px)] w-[calc(100%-72px)]'>
      <div className={cn('relative h-full w-full px-4 py-1.5', className)}>{children}</div>
    </div>
  );
};
