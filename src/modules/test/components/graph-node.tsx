/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState, type Edge, type Node } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },

  {
    id: '2',
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', type: 'step', target: '2' },
  { id: 'e2-3', source: '2', type: 'step', target: '3', animated: true },
];

export const GraphNode = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className='h-[600px] w-[600px]'>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} className='bg-uiSecondaryBg' />
      </ReactFlow>
    </div>
  );
};
