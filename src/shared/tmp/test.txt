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
const MIN_DISTANCE = 150;
const MAIN_NODE_ID = '1';

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

const getCircularPosition = (center: Node, nodes: Node[]) => {
  const numberOfChildren = nodes.length;
  let radius;
  if (numberOfChildren <= 1) {
    radius = NODE_SPACING;
  } else {
    radius = MIN_DISTANCE / (2 * Math.sin(Math.PI / numberOfChildren));
  }
  const angleStep = (2 * Math.PI) / Math.max(numberOfChildren, 1);
  return nodes.map((node, idx) => ({
    ...node,
    position: {
      x: center.position.x + radius * Math.cos(angleStep * idx),
      y: center.position.y + radius * Math.sin(angleStep * idx),
    },
  }));
};

const resolveCollisions = (nodes: Node[]): Node[] => {
  const updatedNodes = [...nodes];
  let hasCollision = true;
  let iterations = 0;
  const maxIterations = 100;

  while (hasCollision && iterations < maxIterations) {
    hasCollision = false;
    for (let i = 0; i < updatedNodes.length; i++) {
      for (let j = i + 1; j < updatedNodes.length; j++) {
        const nodeA = updatedNodes[i];
        const nodeB = updatedNodes[j];
        const dx = nodeA.position.x - nodeB.position.x;
        const dy = nodeA.position.y - nodeB.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < MIN_DISTANCE && distance > 0) {
          hasCollision = true;
          const pushFactor = ((MIN_DISTANCE - distance) / distance) * 0.5;
          const pushX = dx * pushFactor;
          const pushY = dy * pushFactor;
          if (nodeA.id === MAIN_NODE_ID) {
            updatedNodes[j].position.x -= 2 * pushX;
            updatedNodes[j].position.y -= 2 * pushY;
          } else if (nodeB.id === MAIN_NODE_ID) {
            updatedNodes[i].position.x += 2 * pushX;
            updatedNodes[i].position.y += 2 * pushY;
          } else {
            updatedNodes[i].position.x += pushX;
            updatedNodes[i].position.y += pushY;
            updatedNodes[j].position.x -= pushX;
            updatedNodes[j].position.y -= pushY;
          }
        }
      }
    }
    iterations++;
  }

  return updatedNodes;
};

export const NodeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const mainNode = useMemo(() => nodes.find((n) => n.id === MAIN_NODE_ID), [nodes]);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge({ ...params, type: 'custom' }, els)), [setEdges]);

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, clickedNode) => {
      if (!mainNode) return;

      const newNodeId = `${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        position: { x: 0, y: 0 },
        data: { title: 'New Node', subline: 'Child' },
        type: 'custom',
        className: '',
      };

      const newEdge = {
        id: `e${clickedNode.id}-${newNodeId}`,
        source: clickedNode.id,
        target: newNodeId,
        type: 'custom',
      };

      const childEdges = edges.filter((e) => e.source === clickedNode.id);
      const childNodes = nodes.filter((n) => childEdges.some((e) => e.target === n.id)).concat(newNode);
      const arrangedNodes = getCircularPosition(clickedNode, childNodes);

      const updatedNodes = nodes.map((node) => {
        const arrangedNode = arrangedNodes.find((n) => n.id === node.id);
        return arrangedNode ? { ...node, position: arrangedNode.position } : node;
      });

      const newArrangedNode = arrangedNodes.find((n) => n.id === newNode.id);
      const allNodes = [...updatedNodes, newArrangedNode!];

      const finalNodes = resolveCollisions(allNodes);

      setNodes(finalNodes);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, edges, mainNode, setNodes, setEdges],
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
