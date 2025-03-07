import { TestModule } from '@/modules/test/module';
import { PageLayout } from '@components/layouts/page.layout';

export default function Home() {
  return (
    <PageLayout className=''>
      <h1>home</h1>

      <TestModule />
    </PageLayout>
  );
}
