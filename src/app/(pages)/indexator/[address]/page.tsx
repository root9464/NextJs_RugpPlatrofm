import { PageLayout } from '@/components/layouts/page.layout';

export default function IndexatorPage({ params }: { params: { address: string } }) {
  return <PageLayout className='grid grid-cols-[73%_27%] gap-4'>{params.address}</PageLayout>;
}
