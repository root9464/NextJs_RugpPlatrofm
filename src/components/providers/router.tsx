import { useRouter } from 'next/navigation';
import { RouterProvider as ReactAriaRouterProvider } from 'react-aria-components';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return <ReactAriaRouterProvider navigate={router.push}>{children}</ReactAriaRouterProvider>;
};
