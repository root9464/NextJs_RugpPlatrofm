'use client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { RouterProvider } from './router';
import { TanstackProvider } from './tanstack';
import { ThemeProvider } from './theme';
import { TonProvider } from './ton';

export function GlobalProvider({ children, ...props }: { children: Readonly<ReactNode> }) {
  return (
    <RouterProvider>
      <TonProvider>
        <ThemeProvider {...props}>
          <TanstackProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </TanstackProvider>
        </ThemeProvider>
      </TonProvider>
    </RouterProvider>
  );
}
