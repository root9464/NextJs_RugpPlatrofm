'use client';
import {
  addEdge,
  Controls,
  DefaultEdgeOptions,
  EdgeTypes,
  Node,
  NodeMouseHandler,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type OnConnect,
} from '@xyflow/react';
import { useCallback } from 'react';

import '@xyflow/react/dist/base.css';
import { initialEdges, initialNodes } from '../constants/consts';
import { EdgeComponent } from '../slices/edge';
import { NodeComponent } from '../slices/node';
import '../style/style.css';

const nodeTypes: NodeTypes = {
  turbo: NodeComponent,
};

const edgeTypes: EdgeTypes = {
  turbo: EdgeComponent,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

export const NodeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge({ ...params, type: 'turbo' }, els)), [setEdges]);
  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, node: Node) => {
      const newNodeId = `${Date.now()}`;
      const mainNodeId = '1';
      const mainNode = nodes.find((n) => n.id === mainNodeId);

      if (!mainNode) return;

      const newNode: Node = {
        id: newNodeId,
        position: { x: 0, y: 0 },
        data: { title: 'New Node', subline: 'Child' },
        type: 'turbo',
      };

      const newEdge = {
        id: `e${node.id}-${newNodeId}`,
        source: node.id,
        target: newNodeId,
        type: 'turbo',
      };

      const offset = 250;

      if (node.id === mainNodeId) {
        const randomAngle = Math.random() * 2 * Math.PI;
        newNode.position = {
          x: mainNode.position.x + offset * Math.cos(randomAngle),
          y: mainNode.position.y + offset * Math.sin(randomAngle),
        };
      } else {
        const dx = node.position.x - mainNode.position.x;
        const dy = node.position.y - mainNode.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
          newNode.position = {
            x: node.position.x + offset,
            y: node.position.y,
          };
        } else {
          const normalizedDx = (dx / distance) * offset;
          const normalizedDy = (dy / distance) * offset;
          newNode.position = {
            x: node.position.x + normalizedDx,
            y: node.position.y + normalizedDy,
          };
        }
      }

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [setNodes, setEdges, nodes],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      className='bg-uiSecondaryBg'>
      <Controls showInteractive={false} />
      <svg>
        <defs>
          <linearGradient id='edge-gradient'>
            <stop offset='0%' stopColor='#e92a67' />
            <stop offset='50%' stopColor='#a853ba' />
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
  );
};
