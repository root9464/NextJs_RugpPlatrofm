'use client';

import dynamic from 'next/dynamic';

export const HistoryBalanceModule = dynamic(() =>
  import('./module').then((mod) => ({
    default: mod.HistoryBalanceModule,
    ssr: true,
  })),
);
