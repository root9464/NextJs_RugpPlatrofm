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
import '@xyflow/react/dist/base.css';
import { useCallback, useMemo } from 'react';
import { initialEdges, initialNodes } from '../constants/consts';
import { EdgeComponent } from '../slices/edge';
import { NodeComponent } from '../slices/node';
import '../style/style.css';

const NODE_SPACING = 250;
const MAIN_NODE_ID = '1';

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

const getCircularPosition = (center: Node, nodes: Node[], radius: number) => {
  const angleStep = (2 * Math.PI) / nodes.length;
  return nodes.map((node, idx) => ({
    ...node,
    position: {
      x: center.position.x + radius * Math.cos(angleStep * idx),
      y: center.position.y + radius * Math.sin(angleStep * idx),
    },
  }));
};

const calculateDirection = (parent: Node, mainNode: Node, offset: number) => {
  const dx = parent.position.x - mainNode.position.x;
  const dy = parent.position.y - mainNode.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return {
      x: parent.position.x + offset,
      y: parent.position.y,
    };
  }

  const scale = offset / distance;
  return {
    x: parent.position.x + dx * scale,
    y: parent.position.y + dy * scale,
  };
};

export const NodeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const mainNode = useMemo(() => nodes.find((n) => n.id === MAIN_NODE_ID), [nodes]);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge({ ...params, type: 'turbo' }, els)), [setEdges]);

  const hasCollision = useCallback(
    (position: { x: number; y: number }, ignoreId?: string) => {
      return nodes.some((node) => {
        if (node.id === ignoreId) return false;
        const dx = node.position.x - position.x;
        const dy = node.position.y - position.y;
        return Math.sqrt(dx * dx + dy * dy) < NODE_SPACING;
      });
    },
    [nodes],
  );

  const calculatePosition = useCallback(
    (parent: Node, mainNode: Node) => {
      let position = calculateDirection(parent, mainNode, NODE_SPACING);
      let angle = 0;
      let attempts = 0;

      while (hasCollision(position) && attempts < 12) {
        angle += (Math.PI * 2) / 12;
        position = {
          x: parent.position.x + NODE_SPACING * Math.cos(angle),
          y: parent.position.y + NODE_SPACING * Math.sin(angle),
        };
        attempts++;
      }

      return position;
    },
    [hasCollision],
  );

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (!mainNode) return;

      const isMainNode = node.id === MAIN_NODE_ID;
      const newNodeId = `${Date.now()}`;

      const newNode: Node = {
        id: newNodeId,
        position: { x: 0, y: 0 },
        data: { title: 'New Node', subline: 'Child' },
        type: 'turbo',
        className: isMainNode ? 'hidden' : '',
      };

      const newEdge = {
        id: `e${node.id}-${newNodeId}`,
        source: node.id,
        target: newNodeId,
        type: 'turbo',
      };

      if (isMainNode) {
        const updatedNodes = [...nodes, newNode];
        const updatedEdges = [...edges, newEdge];
        const childNodes = updatedNodes.filter((n) => updatedEdges.some((e) => e.source === MAIN_NODE_ID && e.target === n.id));

        const arrangedNodes = getCircularPosition(mainNode, childNodes, NODE_SPACING);
        const finalNodes = updatedNodes.map((n) => arrangedNodes.find((rn) => rn.id === n.id) || n);

        setNodes(finalNodes.map((n) => (n.id === newNodeId ? { ...n, className: '' } : n)));
        setEdges(updatedEdges);
      } else {
        newNode.position = calculatePosition(node, mainNode);
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [nodes, edges, mainNode, setNodes, setEdges, calculatePosition],
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
