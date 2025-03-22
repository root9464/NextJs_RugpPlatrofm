import dynamic from 'next/dynamic';

const manifestUrl = 'https://taiga-labs.github.io/dexlot.json';
const TonConnectUIProvider = dynamic(() => import('@tonconnect/ui-react').then((mod) => mod.TonConnectUIProvider), { ssr: false });

export const TonProvider = ({ children }: { children: React.ReactNode }) => {
  return <TonConnectUIProvider manifestUrl={manifestUrl}>{children}</TonConnectUIProvider>;
};
