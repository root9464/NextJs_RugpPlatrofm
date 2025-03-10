import { Edge, Node } from '@xyflow/react';

export function initialElements(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const center = { x: 0, y: 0 };
  nodes.push({
    id: '1',
    position: center,
    data: { title: 'Wallet', subline: 'то откуда' },
    type: 'custom',
  });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const radius = 250;
    const x = radius * Math.cos(radians) + center.x;
    const y = radius * Math.sin(radians) + center.y;

    const nodeId = `${i + 2}`;
    nodes.push({
      id: nodeId,
      position: { x, y },
      data: { title: `Node ${i + 1}`, subline: `Subline ${i + 1}` },
      type: 'custom',
    });

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
