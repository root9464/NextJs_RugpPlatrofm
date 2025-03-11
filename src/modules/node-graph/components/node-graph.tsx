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
  useNodesInitialized,
  useNodesState,
  useReactFlow,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import ELK from 'elkjs/lib/elk.bundled.js';
import { useCallback, useEffect } from 'react';
import { initialEdges, initialNodes } from '../constants/consts';
import { EdgeComponent } from '../slices/edge';
import { NodeComponent } from '../slices/node';
import '../style/style.css';

const elk = new ELK();
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

const useLayout = () => {
  const { getNodes, setNodes, getEdges } = useReactFlow();
  const initialized = useNodesInitialized();

  const runLayout = useCallback(async () => {
    const nodes = getNodes();
    const edges = getEdges();

    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'org.eclipse.elk.force',
        'elk.spacing.nodeNode': '30',
        'elk.force.repulsion': '2000',
        'elk.edgeRouting': 'ORTHOGONAL',
        'elk.force.edgeElasticity': '100',
        'elk.edgeLabels.inline': 'true',
      },
      children: nodes.map((node) => ({
        ...node,
        width: node.measured?.width || 150,
        height: node.measured?.height || 50,
      })),
      edges: edges.map((edge) => ({
        ...edge,
        layoutOptions: {
          'elk.edge.type': 'straight',
          'elk.edge.smooth': 'false',
        },
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    try {
      const layoutedGraph = await elk.layout(graph);
      const layoutedNodes = layoutedGraph.children
        ?.map((layoutNode) => {
          const originalNode = nodes.find((n) => n.id === layoutNode.id);
          return originalNode
            ? {
                ...originalNode,
                position: {
                  x: layoutNode.x ?? originalNode.position.x,
                  y: layoutNode.y ?? originalNode.position.y,
                },
              }
            : null;
        })
        .filter(Boolean) as Node[];

      setNodes(layoutedNodes);
    } catch (err) {
      console.error('Layout error:', err);
    }
  }, [getNodes, getEdges, setNodes]);

  return { runLayout, initialized };
};

export const NodeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { runLayout, initialized } = useLayout();

  useEffect(() => {
    if (initialized) {
      runLayout();
    }
  }, [initialized, runLayout]);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge({ ...params, type: 'custom' }, els)), [setEdges]);

  const onNodeClick = useCallback<NodeMouseHandler>(
    async (_, clickedNode) => {
      const newNodeId = `${Date.now()}`;
      const mainNode = nodes.find((n) => n.id === MAIN_NODE_ID);

      if (!mainNode) return;

      const newNode: Node = {
        id: newNodeId,
        position: mainNode.position,
        data: { title: 'New Node', subline: 'Child' },
        type: 'custom',
      };

      const newEdge = {
        id: `e${clickedNode.id}-${newNodeId}`,
        source: clickedNode.id,
        target: newNodeId,
        type: 'custom',
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, setNodes, setEdges],
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
