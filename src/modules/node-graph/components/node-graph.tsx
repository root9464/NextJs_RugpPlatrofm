/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { addEdge, Controls, ReactFlow, useEdgesState, useNodesState, type Edge, type Node, type OnConnect } from '@xyflow/react';
import { useCallback } from 'react';

import '@xyflow/react/dist/base.css';
import { IconFile } from 'justd-icons';
import { EdgeComponent } from '../slices/edge';
import { Icon } from '../slices/icon';
import { NodeComponent, TurboNodeData } from '../slices/node';
import '../style/style.css';

const initialNodes: Node<TurboNodeData>[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { icon: <Icon />, title: 'readFile', subline: 'api.ts' },
    type: 'turbo',
  },
  {
    id: '2',
    position: { x: 250, y: 0 },
    data: { icon: <Icon />, title: 'bundle', subline: 'apiContents' },
    type: 'turbo',
  },
  {
    id: '3',
    position: { x: 0, y: 250 },
    data: { icon: <Icon />, title: 'readFile', subline: 'sdk.ts' },
    type: 'turbo',
  },
  {
    id: '4',
    position: { x: 250, y: 250 },
    data: { icon: <Icon />, title: 'bundle', subline: 'sdkContents' },
    type: 'turbo',
  },
  {
    id: '5',
    position: { x: 500, y: 125 },
    data: { icon: <Icon />, title: 'concat', subline: 'api, sdk' },
    type: 'turbo',
  },
  {
    id: '6',
    position: { x: 750, y: 125 },
    data: { icon: <IconFile />, title: 'fullBundle' },
    type: 'turbo',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
  },
];

const nodeTypes = {
  turbo: NodeComponent,
};

const edgeTypes = {
  turbo: EdgeComponent,
};

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

export const NodeGraph = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), [setEdges]);

  return (
    <div className='h-[700px] w-[700px]'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}>
        <Controls showInteractive={false} />
        <svg>
          <defs>
            <linearGradient id='edge-gradient'>
              <stop offset='0%' stopColor='#ae53ba' />
              <stop offset='100%' stopColor='#2a8af6' />
            </linearGradient>

            <marker
              id='edge-circle'
              viewBox='-5 -5 10 10'
              refX='0'
              refY='0'
              markerUnits='strokeWidth'
              markerWidth='10'
              markerHeight='10'
              orient='auto'>
              <circle stroke='#2a8af6' strokeOpacity='0.75' r='2' cx='0' cy='0' />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  );
};
