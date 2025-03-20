import { Edge, useNodesInitialized, useReactFlow, XYPosition } from '@xyflow/react';
import { forceCollide, forceLink, ForceLink, forceManyBody, forceSimulation, Simulation } from 'd3-force';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { TurboSimulationNode } from '../components/node-graph';

const SIMULATION_CONFIG = {
  CHARGE_STRENGTH: -30,
  COLLIDE_ITERATIONS: 10,
  COLLIDE_PADDING: 10,
  LINK_STRENGTH: 0.1,
  LINK_DISTANCE: 150,
  ALPHA_DECAY: 0.05,
  ALPHA_MIN: 0.001,
  DEFAULT_NODE_WIDTH: 100,
  DEFAULT_NODE_HEIGHT: 100,
  MAIN_NODE_ID: '1',
};

const createSimulation = (
  nodes: TurboSimulationNode[],
  edges: Edge[],
  onTick: (nodes: TurboSimulationNode[]) => void,
): Simulation<TurboSimulationNode, Edge> =>
  forceSimulation<TurboSimulationNode>(nodes)
    .force('charge', forceManyBody().strength(SIMULATION_CONFIG.CHARGE_STRENGTH))
    .force(
      'collide',
      forceCollide<TurboSimulationNode>()
        .radius(
          (d) =>
            Math.max(d.measured?.width || SIMULATION_CONFIG.DEFAULT_NODE_WIDTH, d.measured?.height || SIMULATION_CONFIG.DEFAULT_NODE_HEIGHT) /
              2 +
            SIMULATION_CONFIG.COLLIDE_PADDING,
        )
        .iterations(SIMULATION_CONFIG.COLLIDE_ITERATIONS),
    )
    .force(
      'link',
      forceLink<TurboSimulationNode, Edge>(edges)
        .id((d) => d.id)
        .strength(SIMULATION_CONFIG.LINK_STRENGTH)
        .distance(SIMULATION_CONFIG.LINK_DISTANCE),
    )
    .alphaDecay(SIMULATION_CONFIG.ALPHA_DECAY)
    .alphaMin(SIMULATION_CONFIG.ALPHA_MIN)
    .on('tick', () => onTick(nodes));

const updateNodePositions = (nodes: TurboSimulationNode[], simulationNodes: TurboSimulationNode[]): TurboSimulationNode[] =>
  nodes.map((node) => {
    const simNode = simulationNodes.find((n) => n.id === node.id);
    if (!simNode) return node;
    return {
      ...node,
      position: {
        x: simNode.x - (node.measured?.width || SIMULATION_CONFIG.DEFAULT_NODE_WIDTH) / 2,
        y: simNode.y - (node.measured?.height || SIMULATION_CONFIG.DEFAULT_NODE_HEIGHT) / 2,
      },
    };
  });

export const useForceLayout = () => {
  const { getNodes, setNodes, getEdges } = useReactFlow<TurboSimulationNode>();
  const initialized = useNodesInitialized();
  const simulationRef = useRef<Simulation<TurboSimulationNode, Edge>>();
  const draggingId = useRef<string | undefined>();

  const getCenteredNodes = useCallback(
    () =>
      getNodes().map((node) => ({
        ...node,
        x: node.x ?? node.position.x + (node.measured?.width || SIMULATION_CONFIG.DEFAULT_NODE_WIDTH) / 2,
        y: node.y ?? node.position.y + (node.measured?.height || SIMULATION_CONFIG.DEFAULT_NODE_HEIGHT) / 2,
      })),
    [getNodes],
  );

  const fixMainNode = useCallback((nodes: TurboSimulationNode[]) => {
    const mainNode = nodes.find((n) => n.id === SIMULATION_CONFIG.MAIN_NODE_ID);
    if (mainNode) {
      mainNode.fx = mainNode.x;
      mainNode.fy = mainNode.y;
    }
    return nodes;
  }, []);

  const handleTick = useCallback(
    () =>
      setNodes((nodes) => {
        const simNodes = simulationRef.current?.nodes() ?? [];
        return updateNodePositions(nodes, simNodes);
      }),
    [setNodes],
  );

  useEffect(() => {
    if (!initialized) return;

    const nodes = fixMainNode(getCenteredNodes());
    const edges = getEdges();

    const simulation = createSimulation(nodes, edges, handleTick);
    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [getCenteredNodes, getEdges, initialized, handleTick, fixMainNode]);

  const handleDrag = useCallback((position: XYPosition, node: TurboSimulationNode) => {
    const simNode = simulationRef.current?.nodes().find((n) => n.id === node.id);
    if (!simNode) return;

    simNode.fx = position.x + (node.measured?.width || SIMULATION_CONFIG.DEFAULT_NODE_WIDTH) / 2;
    simNode.fy = position.y + (node.measured?.height || SIMULATION_CONFIG.DEFAULT_NODE_HEIGHT) / 2;
    simulationRef.current?.alpha(0.5).restart();
  }, []);

  const handleDragStart = useCallback(
    (_: unknown, node: TurboSimulationNode) => {
      draggingId.current = node.id;
      handleDrag(node.position, node);
    },
    [handleDrag],
  );

  const handleDragStop = useCallback(() => {
    const simNode = simulationRef.current?.nodes().find((n) => n.id === draggingId.current);
    if (simNode) {
      simNode.fx = simNode.id === SIMULATION_CONFIG.MAIN_NODE_ID ? simNode.x : null;
      simNode.fy = simNode.id === SIMULATION_CONFIG.MAIN_NODE_ID ? simNode.y : null;
    }
    draggingId.current = undefined;
  }, []);

  const updateSimulation = useCallback(() => {
    if (!simulationRef.current) return;

    const nodes = fixMainNode(getCenteredNodes());
    simulationRef.current.nodes(nodes);
    (simulationRef.current.force('link') as ForceLink<TurboSimulationNode, Edge>)?.links(getEdges());
    simulationRef.current.alpha(0.5).restart();
  }, [fixMainNode, getCenteredNodes, getEdges]);

  return useMemo(
    () => ({
      onNodeDragStart: handleDragStart,
      onNodeDrag: handleDrag,
      onNodeDragStop: handleDragStop,
      updateSimulation,
    }),
    [handleDragStart, handleDrag, handleDragStop, updateSimulation],
  );
};
