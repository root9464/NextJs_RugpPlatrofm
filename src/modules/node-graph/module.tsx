import { Card } from '@/components/ui';
import Image from 'next/image';

import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';
import { ReactFlowProvider } from '@xyflow/react';
import { NodeGraph } from './components/node-graph';

export const NodeGraphModule = () => {
  return (
    <div className='flex h-full w-full flex-col gap-2.5'>
      <Card className='bg-uiSecondaryBg flex h-full w-full flex-col gap-5 border-0 border-none text-white'>
        <Card.Header className='flex w-full flex-row items-center justify-between pb-0'>
          <div className='flex items-center gap-2'>
            <Image src={ScreenShotIco} alt='Screen Shot' width={20} height={20} />
            <Image src={OpenFullSizeIco} alt='Open Full Size' width={20} height={20} />
          </div>
        </Card.Header>
        <Card.Content className='relative z-0 h-full w-full border-none px-0'>
          <ReactFlowProvider>
            <NodeGraph />
          </ReactFlowProvider>
        </Card.Content>
      </Card>
    </div>
  );
};
