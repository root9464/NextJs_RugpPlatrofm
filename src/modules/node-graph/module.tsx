'use client';
import { Card } from '@/components/ui';
import Image from 'next/image';
import { useRef } from 'react';
import { GraphCanvas, GraphCanvasRef, useSelection } from 'reagraph';
import { edges, nodes, theme } from './constants/consts';

import OpenFullSizeIco from '@assets/svg/fullsize.svg';
import ScreenShotIco from '@assets/svg/screenshot.svg';
import ScamArrowIco from '@assets/svg/tr-arrow/scam.svg';
import TransferArrowIco from '@assets/svg/tr-arrow/transfer.svg';

export const NodeGraphModule = () => {
  const graphRef = useRef<GraphCanvasRef | null>(null);

  const { selections, actives, onCanvasClick, onNodePointerOver, onNodePointerOut } = useSelection({
    ref: graphRef,
    nodes: nodes,
    edges: edges,
    pathHoverType: 'out',
  });

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
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            theme={theme}
            ref={graphRef}
            selections={selections}
            actives={actives}
            onNodePointerOver={onNodePointerOver}
            onNodePointerOut={onNodePointerOut}
            onCanvasClick={onCanvasClick}
            onNodeClick={(node) => console.log('Клик по узлу:', node)}
            onEdgeClick={(edge) => console.log('Клик по связи:', edge)}
          />
          <LegendGraph />
        </Card.Content>
      </Card>
    </div>
  );
};

const LegendItems = [
  {
    id: 1,
    text: 'Transfer',
    img: TransferArrowIco,
  },
  {
    id: 2,
    text: 'Swaps',
    img: TransferArrowIco,
  },
  {
    id: 3,
    text: 'Stake',
    img: TransferArrowIco,
  },
  {
    id: 4,
    text: 'Scam',
    img: ScamArrowIco,
  },
];

const LegendGraph = () => (
  <div className='absolute right-5 bottom-5 flex flex-col gap-2 bg-transparent text-white'>
    <h3>Legend</h3>
    {LegendItems.map((item) => (
      <div className='flex flex-row gap-2' key={item.id}>
        <p className='text-uiPrimaryText font-medium'>{item.text}</p>
        <Image src={item.img} alt={item.text} width={30} height={30} />
      </div>
    ))}
  </div>
);
