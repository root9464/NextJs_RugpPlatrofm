import { NodeGraph } from '@/modules/node-graph/components/node-graph';
import { PageLayout } from '@components/layouts/page.layout';
import { ReactFlowProvider } from '@xyflow/react';

export default function Home() {
  return (
    <PageLayout className=''>
      <h1>home</h1>

      <div className='h-screen w-screen'>
        <ReactFlowProvider>
          <NodeGraph />
        </ReactFlowProvider>
      </div>
    </PageLayout>
  );
}
