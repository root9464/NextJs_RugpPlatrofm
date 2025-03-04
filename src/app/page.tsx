import { Timeline } from '@/components/timeline';
import { PageLayout } from '@components/layouts/page.layout';

export default function Home() {
  return (
    <PageLayout className=''>
      <h1>home</h1>

      <Timeline />
    </PageLayout>
  );
}
