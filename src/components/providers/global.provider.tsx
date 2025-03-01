'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { RouterProvider } from 'react-aria-components';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

const TonConnectUIProvider = dynamic(() => import('@tonconnect/ui-react').then((mod) => mod.TonConnectUIProvider), { ssr: false });

export function GlobalProvider({ children, ...props }: { children: Readonly<ReactNode> }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <RouterProvider navigate={router.push}>
      <TonConnectUIProvider manifestUrl='https://taiga-labs.github.io/dexlot.json'>
        <NextThemesProvider enableSystem storageKey='justd-theme' {...props}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </NextThemesProvider>
      </TonConnectUIProvider>
    </RouterProvider>
  );
}
