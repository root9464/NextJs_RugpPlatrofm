import { Edge } from '@xyflow/react';
import { TurboSimulationNode } from '../components/node-graph';
export function initialElements(): { nodes: TurboSimulationNode[]; edges: Edge[] } {
  const nodes: TurboSimulationNode[] = [];
  const edges: Edge[] = [];

  const center = { x: 0, y: 0 };
  const mainNode: TurboSimulationNode = {
    id: '1',
    position: center,
    x: center.x,
    y: center.y,
    data: { title: 'Wallet', subline: 'то откуда' },
    type: 'custom',
  };
  nodes.push(mainNode);

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const radius = 250;
    const x = radius * Math.cos(radians) + center.x;
    const y = radius * Math.sin(radians) + center.y;

    const nodeId = `${i + 2}`;
    const node: TurboSimulationNode = {
      id: nodeId,
      position: { x, y },
      x,
      y,
      data: { title: `Node ${i + 1}`, subline: `Subline ${i + 1}` },
      type: 'custom',
    };
    nodes.push(node);

    edges.push({
      id: `e1-${nodeId}`,
      source: '1',
      target: nodeId,
      type: 'custom',
    });
  }

  return { nodes, edges };
}

export const { nodes: initialNodes, edges: initialEdges } = initialElements();
