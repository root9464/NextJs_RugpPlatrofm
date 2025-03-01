'use client';
import { useUserBalance } from '@/shared/hooks/useUserBalance';
import { PageLayout } from '@components/layouts/page.layout';
import { useTonAddress } from '@tonconnect/ui-react';

export default function Home() {
  const address = useTonAddress();
  const { data } = useUserBalance(address);
  console.log(data);

  return (
    <PageLayout className='grid grid-cols-[73%_27%]'>
      <h1>fff</h1>
      <h1>ccc</h1>
    </PageLayout>
  );
}
