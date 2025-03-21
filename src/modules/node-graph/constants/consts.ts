import { Edge } from '@xyflow/react';
import { CustomNodeType } from '../components/node-graph';

export function initialElements(): { nodes: CustomNodeType[]; edges: Edge[] } {
  const nodes: CustomNodeType[] = [];
  const edges: Edge[] = [];

  const center = { x: 0, y: 0 };
  const mainNode: CustomNodeType = {
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
    const node: CustomNodeType = {
      id: nodeId,
      position: { x, y },
      x,
      y,
      data: { title: `Node ${i + 1}`, subline: `Subline ${i + 1}`, size: Math.random() * 100 + 50 },
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
