'use client';
import {
  addEdge,
  Controls,
  DefaultEdgeOptions,
  Edge,
  EdgeTypes,
  Node,
  NodeMouseHandler,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { useCallback, useMemo } from 'react';
import { initialEdges, initialNodes } from '../constants/consts';
import { useForceLayout } from '../hooks/useForceLayout';
import { EdgeComponent } from '../slices/edge';
import { NodeComponent, TurboNodeData } from '../slices/node';
import '../style/style.css';

const MAIN_NODE_ID = '1';

export type TurboSimulationNode = {
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

export const NodeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<TurboSimulationNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const mainNode = useMemo(() => nodes.find((n) => n.id === MAIN_NODE_ID), [nodes]);

  const { onNodeDragStart, onNodeDrag, onNodeDragStop, updateSimulation } = useForceLayout();

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge({ ...params, type: 'custom' }, els)), [setEdges]);

  const addNodeToParent = useCallback(
    (parentNode: TurboSimulationNode) => {
      if (!mainNode) return;
      const newNodeId = `${Date.now()}`;
      const parentCenterX = parentNode.position.x + (parentNode.measured?.width || 100) / 2;
      const parentCenterY = parentNode.position.y + (parentNode.measured?.height || 100) / 2;
      const newNode: TurboSimulationNode = {
        id: newNodeId,
        position: { x: parentCenterX - 50, y: parentCenterY - 50 + 100 },
        x: parentCenterX,
        y: parentCenterY + 100,
        data: { title: 'New Node', subline: 'Child' },
        type: 'custom',
      };
      const newEdge: Edge = {
        id: `e${parentNode.id}-${newNodeId}`,
        source: parentNode.id,
        target: newNodeId,
        type: 'custom',
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
      updateSimulation();
    },
    [mainNode, setNodes, setEdges, updateSimulation],
  );

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, clickedNode) => {
      addNodeToParent(clickedNode as TurboSimulationNode);
    },
    [addNodeToParent],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
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
