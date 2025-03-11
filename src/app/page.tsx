import { NodeGraph } from '@/modules/node-graph/components/node-graph';
import { PageLayout } from '@components/layouts/page.layout';

export default function Home() {
  return (
    <PageLayout className=''>
      <h1>home</h1>

      <div className='h-screen w-screen'>
        <NodeGraph />
      </div>
    </PageLayout>
  );
}
