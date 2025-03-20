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
  useNodesInitialized,
  useNodesState,
  useReactFlow,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { forceCollide, ForceLink, forceLink, forceManyBody, forceSimulation, Simulation } from 'd3-force';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { initialEdges, initialNodes } from '../constants/consts';
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
      onNodeDrag={onNodeDrag}
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

export const useForceLayout = () => {
  const { getNodes, setNodes, getEdges } = useReactFlow<TurboSimulationNode, Edge>();
  const initialized = useNodesInitialized();
  const simulationRef = useRef<Simulation<TurboSimulationNode, Edge> | null>(null);
  const draggingNodeRef = useRef<TurboSimulationNode | null>(null);

  const MAIN_NODE_ID = '1';

  useEffect(() => {
    if (!initialized) return;

    const nodes = getNodes().map((node) => ({
      ...node,
      x: node.x ?? node.position.x + (node.measured?.width || 50) / 2,
      y: node.y ?? node.position.y + (node.measured?.height || 50) / 2,
    }));

    const mainNode = nodes.find((n) => n.id === MAIN_NODE_ID);
    if (mainNode) {
      mainNode.fx = mainNode.x;
      mainNode.fy = mainNode.y;
    }

    const edges = getEdges();

    const simulation = forceSimulation<TurboSimulationNode, Edge>(nodes)
      .force('charge', forceManyBody().strength(-30)) // Отталкивание
      .force(
        'collide',
        forceCollide<TurboSimulationNode>()
          .radius((d) => {
            const width = d.measured?.width || 100;
            const height = d.measured?.height || 100;
            return Math.max(width, height) / 2 + 10;
          })
          .iterations(10),
      )
      .force(
        'link',
        forceLink<TurboSimulationNode, Edge>(edges)
          .id((d) => d.id)
          .strength(0.1)
          .distance(150),
      )
      .alphaDecay(0.05)
      .alphaMin(0.001);

    simulationRef.current = simulation;

    const handleTick = () => {
      const updatedNodes = getNodes().map((node) => {
        const simNode = simulation.nodes().find((n) => n.id === node.id);
        if (simNode) {
          const width = node.measured?.width || 100;
          const height = node.measured?.height || 100;
          return {
            ...node,
            position: {
              x: simNode.x - width / 2,
              y: simNode.y - height / 2,
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    };

    simulation.on('tick', handleTick);

    return () => {
      simulation.stop();
      simulation.on('tick', null);
    };
  }, [initialized, getNodes, setNodes, getEdges]);

  const onNodeDragStart = useCallback((_: unknown, node: TurboSimulationNode) => {
    draggingNodeRef.current = node;
    if (simulationRef.current) {
      simulationRef.current.alpha(0.5).restart();
    }
  }, []);

  const onNodeDrag = useCallback((_: unknown, node: TurboSimulationNode) => {
    draggingNodeRef.current = node;
    if (simulationRef.current) {
      const simNode = simulationRef.current.nodes().find((n) => n.id === node.id);
      if (simNode) {
        simNode.fx = node.position.x + (node.measured?.width || 50) / 2;
        simNode.fy = node.position.y + (node.measured?.height || 50) / 2;
      }
    }
  }, []);

  const onNodeDragStop = useCallback(() => {
    if (draggingNodeRef.current && simulationRef.current) {
      const simNode = simulationRef.current.nodes().find((n) => n.id === draggingNodeRef.current!.id);
      if (simNode) {
        if (simNode.id === MAIN_NODE_ID) {
          simNode.fx = simNode.x;
          simNode.fy = simNode.y;
        } else {
          simNode.fx = null;
          simNode.fy = null;
        }
      }
      draggingNodeRef.current = null;
      simulationRef.current.alpha(0.5).restart();
    }
  }, []);

  const updateSimulation = useCallback(() => {
    if (simulationRef.current) {
      const nodes = getNodes().map((node) => ({
        ...node,
        x: node.x ?? node.position.x + (node.measured?.width || 50) / 2,
        y: node.y ?? node.position.y + (node.measured?.height || 50) / 2,
      }));
      const mainNode = nodes.find((n) => n.id === MAIN_NODE_ID);
      if (mainNode) {
        mainNode.fx = mainNode.x;
        mainNode.fy = mainNode.y;
      }
      const edges = getEdges();
      simulationRef.current.nodes(nodes);
      (simulationRef.current.force('link') as ForceLink<TurboSimulationNode, Edge>)?.links(edges);
      simulationRef.current.alpha(0.5).restart();
    }
  }, [getNodes, getEdges]);

  return { onNodeDragStart, onNodeDrag, onNodeDragStop, updateSimulation };
};
