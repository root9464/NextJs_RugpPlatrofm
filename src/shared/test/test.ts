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
import { EdgeComponent } from '../slices/edge';
import { NodeComponent } from '../slices/node';
import '../style/style.css';
import { getCircularPosition, resolveCollisions } from '../utils/utils';

const NODE_SPACING = 300;
const MIN_DISTANCE = 200;
const MAIN_NODE_ID = '1';
const MAX_NODES_PER_ORBIT = 100;
const ORBIT_SPACING = 250;

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const mainNode = useMemo(() => nodes.find((n) => n.id === MAIN_NODE_ID), [nodes]);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge({ ...params, type: 'custom' }, els)), [setEdges]);

  // Function to recursively arrange the entire tree
  const arrangeTree = useCallback((mainNode: Node, allNodes: Node[], allEdges: Edge[]) => {
    const arrangedNodes: Node[] = [mainNode]; // Include main node with its fixed position

    const arrangeSubtree = (node: Node) => {
      // Find all child nodes of the current node
      const childEdges = allEdges.filter((e) => e.source === node.id);
      const childNodes = allNodes.filter((n) => childEdges.some((e) => e.target === n.id));
      // Arrange children around the current node
      const arrangedChildren = getCircularPosition(node, childNodes, allEdges, allNodes, NODE_SPACING, MAX_NODES_PER_ORBIT, ORBIT_SPACING);
      arrangedNodes.push(...arrangedChildren);
      // Recursively arrange each child's subtree
      arrangedChildren.forEach((child) => arrangeSubtree(child));
    };

    arrangeSubtree(mainNode);
    return arrangedNodes;
  }, []);

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, clickedNode) => {
      if (!mainNode) return;

      const newNodeId = `${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        position: { x: 0, y: 0 }, // Temporary position, will be set by arrangeTree
        data: { title: 'New Node', subline: 'Child' },
        type: 'custom',
      };
      const newEdge = {
        id: `e${clickedNode.id}-${newNodeId}`,
        source: clickedNode.id,
        target: newNodeId,
        type: 'custom',
      };

      // Update nodes with the new node and rearrange the entire tree
      setNodes((nds) => {
        const updatedNodes = [...nds, newNode];
        const updatedEdges = [...edges, newEdge];
        const arrangedNodes = arrangeTree(mainNode, updatedNodes, updatedEdges);
        const finalNodes = resolveCollisions(arrangedNodes, MIN_DISTANCE, mainNode.id);
        return finalNodes;
      });
      setEdges((eds) => [...eds, newEdge]);
    },
    [mainNode, edges, setNodes, setEdges, arrangeTree],
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
