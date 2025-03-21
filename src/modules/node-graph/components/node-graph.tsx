'use client';
import {
  addEdge,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type DefaultEdgeOptions,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { useCallback, useMemo } from 'react';
import { initialEdges, initialNodes } from '../constants/consts';
import { useForceLayout } from '../hooks/useForceLayout';
import { EdgeComponent } from '../slices/edge';
import { NodeComponent, TurboNodeData } from '../slices/node';
import '../style/style.css';
import { calculateMainNodeSize, createNode } from '../utils/utils';

export type CustomNodeType = {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
} & Node<TurboNodeData>;

const nodeTypes: NodeTypes = {
  custom: NodeComponent,
};

const edgeTypes: EdgeTypes = {
  custom: EdgeComponent,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'custom',
  markerEnd: 'edge-circle',
};
const MIN_NODE_SIZE = 30;
const MAX_NODE_SIZE = 180;
const MAIN_NODE_ID = '1';

const nodeOptions = { MAIN_NODE_ID, MIN_NODE_SIZE, MAX_NODE_SIZE };

export const NodeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const { onNodeDragStart, onNodeDrag, onNodeDragStop, updateSimulation } = useForceLayout();

  const mainNode = useMemo(() => nodes.find((n) => n.id === MAIN_NODE_ID), [nodes]);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge({ ...params, type: 'custom' }, els)), [setEdges]);

  const onNodeClick = useCallback(
    (clickedNode: CustomNodeType) => {
      if (!mainNode) return;

      if (clickedNode.id === MAIN_NODE_ID) {
        const { newNode, newEdge } = createNode(clickedNode, nodeOptions);

        setNodes((prev) => {
          const updatedNodes = [...prev, newNode];
          const newMainSize = calculateMainNodeSize([...prev, newNode], [...edges, newEdge], nodeOptions);
          return updatedNodes.map((node) => (node.id === MAIN_NODE_ID ? { ...node, data: { ...node.data, size: newMainSize } } : node));
        });
        setEdges((prev) => [...prev, newEdge]);
        updateSimulation();
      } else if (edges.some((e) => e.source === MAIN_NODE_ID && e.target === clickedNode.id)) {
        const isChild = edges.some((e) => e.source === MAIN_NODE_ID && e.target === clickedNode.id);
        const currentSize = clickedNode.data.size ?? 96;

        if (isChild && currentSize < MAX_NODE_SIZE) {
          setNodes((prev) => {
            const updatedNodes = prev.map((node) =>
              node.id === clickedNode.id ? { ...node, data: { ...node.data, size: Math.round(currentSize * 1.2) } } : node,
            );

            const newMainSize = calculateMainNodeSize(updatedNodes, edges, nodeOptions);

            return updatedNodes.map((node) => (node.id === MAIN_NODE_ID ? { ...node, data: { ...node.data, size: newMainSize } } : node));
          });
        }
      }
    },
    [mainNode, edges, setNodes, setEdges, updateSimulation],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={(_, clickedNode) => onNodeClick(clickedNode as CustomNodeType)}
      onConnect={onConnect}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={(_, node) => onNodeDrag(node.position, node)}
      onNodeDragStop={onNodeDragStop}
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
