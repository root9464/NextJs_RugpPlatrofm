import { Edge, InternalNode, Node, Position } from '@xyflow/react';

const getNodeIntersection = (intersectionNode: InternalNode<Node>, targetNode: InternalNode<Node>) => {
  const { width: intersectionNodeWidth = 0, height: intersectionNodeHeight = 0 } = intersectionNode.measured;
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + (targetNode.measured.width ?? 0) / 2;
  const y1 = targetPosition.y + (targetNode.measured.height ?? 0) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
};

const getEdgePosition = (node: InternalNode<Node>, intersectionPoint: { x: number; y: number }) => {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (n.measured.width ?? 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + (n.measured.height ?? 0) - 1) {
    return Position.Bottom;
  }

  return Position.Top;
};

export const getEdgeParams = (source: InternalNode<Node>, target: InternalNode<Node>) => {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
};

export const resolveCollisions = (nodes: Node[], minDistance: number, mainNodeId: string) => {
  const nodeMap = new Map<string, Node>(nodes.map((n) => [n.id, { ...n }]));
  const REPULSE_FORCE = 0.15;
  const MAX_ITERATIONS = 150;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let hasCollision = false;

    nodes.forEach((nodeA, i) => {
      nodes.forEach((nodeB, j) => {
        if (i >= j) return;

        const dx = nodeA.position.x - nodeB.position.x;
        const dy = nodeA.position.y - nodeB.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          hasCollision = true;
          const force = ((minDistance - distance) / distance) * REPULSE_FORCE;

          const updateNode = (node: Node, fx: number, fy: number) => {
            const updated = nodeMap.get(node.id)!;
            updated.position.x += fx;
            updated.position.y += fy;
            nodeMap.set(node.id, updated);
          };

          if (nodeA.id !== mainNodeId) updateNode(nodeA, dx * force, dy * force);
          if (nodeB.id !== mainNodeId) updateNode(nodeB, -dx * force, -dy * force);
        }
      });
    });

    if (!hasCollision) break;
  }

  return Array.from(nodeMap.values());
};

export const getCircularPosition = (
  center: Node,
  nodes: Node[],
  edges: Edge[],
  allNodes: Node[],
  nodeSpacing: number,
  maxNodePerOrbit: number,
  orbitSpacing: number,
) => {
  const parentEdge = edges.find((e) => e.target === center.id);
  const parentNode = parentEdge ? allNodes.find((n) => n.id === parentEdge.source) : null;
  const baseAngle = parentNode ? Math.atan2(center.position.y - parentNode.position.y, center.position.x - parentNode.position.x) : -Math.PI;

  const totalChildren = nodes.length;
  const radius = nodeSpacing + Math.floor((totalChildren - 1) / maxNodePerOrbit) * orbitSpacing;

  return nodes.map((node, idx) => {
    if (totalChildren === 1) {
      return {
        ...node,
        position: {
          x: center.position.x + radius * Math.cos(baseAngle),
          y: center.position.y + radius * Math.sin(baseAngle),
        },
      };
    }

    const angleStep = (2 * Math.PI) / totalChildren;
    const angle = baseAngle + angleStep * idx;

    return {
      ...node,
      position: {
        x: center.position.x + radius * Math.cos(angle),
        y: center.position.y + radius * Math.sin(angle),
      },
    };
  });
};
