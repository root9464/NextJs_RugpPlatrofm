'use client';

import dynamic from 'next/dynamic';

export const NodeGraphModule = dynamic(() => import('./module').then((mod) => mod.NodeGraphModule), { ssr: false });
