import { Edge, useNodesInitialized, useReactFlow, XYPosition } from '@xyflow/react';
import { forceCollide, ForceLink, forceLink, forceManyBody, forceSimulation, Simulation } from 'd3-force';
import { useEffect, useRef } from 'react';
import { TurboSimulationNode } from '../components/node-graph';

const SIMULATION_CONFIG = {
  chargeStrength: -15,
  collideIterations: 10,
  collidePadding: 10,
  linkStrength: 0.1,
  linkDistance: 150,
  alphaDecay: 0.1,
  alphaMin: 0.001,
  defaultSize: 100,
  mainNodeId: '1',
  velocityDecay: 0.4,
};

const configureSimulation = (nodes: TurboSimulationNode[], edges: Edge[], onTick: () => void): Simulation<TurboSimulationNode, Edge> => {
  const collisionRadius = (node: TurboSimulationNode) => {
    const { width = SIMULATION_CONFIG.defaultSize, height = SIMULATION_CONFIG.defaultSize } = node.measured || {};
    return Math.max(width, height) / 2 + SIMULATION_CONFIG.collidePadding;
  };

  return forceSimulation<TurboSimulationNode>(nodes)
    .force('charge', forceManyBody().strength(SIMULATION_CONFIG.chargeStrength))
    .force('collide', forceCollide<TurboSimulationNode>().radius(collisionRadius).iterations(SIMULATION_CONFIG.collideIterations))
    .force(
      'link',
      forceLink<TurboSimulationNode, Edge>(edges)
        .id((d) => d.id)
        .strength(SIMULATION_CONFIG.linkStrength)
        .distance(SIMULATION_CONFIG.linkDistance),
    )
    .alphaDecay(SIMULATION_CONFIG.alphaDecay)
    .alphaMin(SIMULATION_CONFIG.alphaMin)
    .velocityDecay(SIMULATION_CONFIG.velocityDecay)
    .on('tick', onTick);
};

const adjustNodeCoordinates = (nodes: TurboSimulationNode[]): TurboSimulationNode[] =>
  nodes.map((node) => ({
    ...node,
    x: node.x ?? node.position.x + (node.measured?.width || SIMULATION_CONFIG.defaultSize) / 2,
    y: node.y ?? node.position.y + (node.measured?.height || SIMULATION_CONFIG.defaultSize) / 2,
  }));

const lockMainNodePosition = (nodes: TurboSimulationNode[]): TurboSimulationNode[] => {
  const mainNode = nodes.find((n) => n.id === SIMULATION_CONFIG.mainNodeId);
  if (mainNode) [mainNode.fx, mainNode.fy] = [mainNode.x, mainNode.y];
  return nodes;
};

const stabilizeExistingNodes = (newNodes: TurboSimulationNode[], existingNodes: TurboSimulationNode[] = []) => {
  return newNodes.map((node) => {
    const existing = existingNodes.find((n) => n.id === node.id);
    return existing ? { ...node, x: existing.x, y: existing.y } : node;
  });
};

const syncNodePositions = (currentNodes: TurboSimulationNode[], simulationNodes: TurboSimulationNode[]) =>
  currentNodes.map((node) => {
    const simNode = simulationNodes.find((n) => n.id === node.id);
    if (!simNode) return node;

    const width = node.measured?.width || SIMULATION_CONFIG.defaultSize;
    const height = node.measured?.height || SIMULATION_CONFIG.defaultSize;

    return {
      ...node,
      position: { x: simNode.x - width / 2, y: simNode.y - height / 2 },
    };
  });

export const useForceLayout = () => {
  const { getNodes, setNodes, getEdges } = useReactFlow<TurboSimulationNode>();
  const initialized = useNodesInitialized();
  const simulation = useRef<Simulation<TurboSimulationNode, Edge>>();
  const draggedNodeId = useRef<string>();

  useEffect(() => {
    if (!initialized) return;

    const currentNodes = getNodes();
    const stabilizedNodes = stabilizeExistingNodes(adjustNodeCoordinates(currentNodes), simulation.current?.nodes() || []);
    const nodes = lockMainNodePosition(stabilizedNodes);
    const edges = getEdges();

    const handleSimulationTick = () => {
      setNodes((current) => syncNodePositions(current, simulation.current?.nodes() || []));
    };

    const newSimulation = configureSimulation(nodes, edges, handleSimulationTick);
    simulation.current = newSimulation;

    return () => {
      newSimulation.stop();
    };
  }, [initialized, getNodes, getEdges, setNodes]);

  const updateNodePosition = (position: XYPosition, node: TurboSimulationNode) => {
    const simNode = simulation.current?.nodes().find((n) => n.id === node.id);
    if (!simNode) return;

    const { width = SIMULATION_CONFIG.defaultSize, height = SIMULATION_CONFIG.defaultSize } = node.measured || {};
    [simNode.fx, simNode.fy] = [position.x + width / 2, position.y + height / 2];
    simulation.current?.alpha(0.5).restart();
  };

  const releaseNodePosition = () => {
    const simNode = simulation.current?.nodes().find((n) => n.id === draggedNodeId.current);
    if (!simNode) return;

    const shouldLock = simNode.id === SIMULATION_CONFIG.mainNodeId;
    if (!shouldLock) {
      simNode.fx = null;
      simNode.fy = null;
    }
    draggedNodeId.current = undefined;
    simulation.current?.alpha(0.5).restart();
  };

  const refreshSimulation = () => {
    if (!simulation.current) return;

    const currentNodes = getNodes();
    const stabilizedNodes = stabilizeExistingNodes(adjustNodeCoordinates(currentNodes), simulation.current.nodes());
    const nodes = lockMainNodePosition(stabilizedNodes);
    const edges = getEdges();
    simulation.current.nodes(nodes);
    (simulation.current.force('link') as ForceLink<TurboSimulationNode, Edge>).links(edges);
    simulation.current.alpha(1).restart();
  };

  return {
    onNodeDragStart: (_: unknown, node: TurboSimulationNode) => {
      draggedNodeId.current = node.id;
      updateNodePosition(node.position, node);
    },
    onNodeDrag: updateNodePosition,
    onNodeDragStop: releaseNodePosition,
    updateSimulation: refreshSimulation,
  };
};
