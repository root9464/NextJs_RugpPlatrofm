import { AssetsMenu } from '@/modules/history-transactions/entities/assets-menu';
import { PageLayout } from '@components/layouts/page.layout';

export default function Home() {
  return (
    <PageLayout className=''>
      <h1>home</h1>

      <AssetsMenu />
    </PageLayout>
  );
}
