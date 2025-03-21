import { Edge, InternalNode, MarkerType, Node, Position } from '@xyflow/react';
import { CustomNodeType } from '../components/node-graph';

const getNodeIntersection = (node: InternalNode<Node>, otherNode: InternalNode<Node>) => {
  const nodeCenterX = node.internals.positionAbsolute.x + (node.measured.width ?? 0) / 2;
  const nodeCenterY = node.internals.positionAbsolute.y + (node.measured.height ?? 0) / 2;
  const otherCenterX = otherNode.internals.positionAbsolute.x + (otherNode.measured.width ?? 0) / 2;
  const otherCenterY = otherNode.internals.positionAbsolute.y + (otherNode.measured.height ?? 0) / 2;

  const dx = otherCenterX - nodeCenterX;
  const dy = otherCenterY - nodeCenterY;
  const angle = Math.atan2(dy, dx);

  const nodeRadius = Math.min(node.measured.width ?? 0, node.measured.height ?? 0) / 2;

  const intersectionX = nodeCenterX + nodeRadius * Math.cos(angle);
  const intersectionY = nodeCenterY + nodeRadius * Math.sin(angle);

  return { x: intersectionX, y: intersectionY };
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

const getEdgeParams = (source: InternalNode<Node>, target: InternalNode<Node>) => {
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

const createNode = (
  clickedNode: CustomNodeType,
  { MAIN_NODE_ID, MIN_NODE_SIZE, MAX_NODE_SIZE }: { MAIN_NODE_ID: string; MIN_NODE_SIZE: number; MAX_NODE_SIZE: number },
) => {
  const isMainNode = clickedNode.id === MAIN_NODE_ID;
  const isIncoming = Math.random() < 0.5;

  const nodeId = `${Date.now()}`;
  const [source, target] = isMainNode ? (isIncoming ? [nodeId, MAIN_NODE_ID] : [MAIN_NODE_ID, nodeId]) : [null, null];

  const measuredSize = {
    width: clickedNode.measured?.width || 100,
    height: clickedNode.measured?.height || 100,
  };

  const center = {
    x: clickedNode.position.x + measuredSize.width / 2,
    y: clickedNode.position.y + measuredSize.height / 2,
  };

  const newNode: CustomNodeType = {
    id: nodeId,
    position: { x: center.x - 50, y: center.y + 50 },
    x: center.x,
    y: center.y + 100,
    data: {
      title: 'New Node',
      subline: isIncoming ? 'Incoming' : 'Outgoing',
      size: Math.floor(Math.random() * (MAX_NODE_SIZE - MIN_NODE_SIZE) + MIN_NODE_SIZE),
    },
    type: 'custom',
  };

  const newEdge: Edge = {
    id: `e${source}-${target}-${Date.now()}`,
    source: source!,
    target: target!,
    type: 'custom',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: isIncoming ? '#FF0000' : '#00FF00',
    },
  };

  return { newNode, newEdge };
};

const calculateMainNodeSize = (
  nodes: CustomNodeType[],
  edges: Edge[],
  { MAIN_NODE_ID, MIN_NODE_SIZE, MAX_NODE_SIZE }: { MAIN_NODE_ID: string; MIN_NODE_SIZE: number; MAX_NODE_SIZE: number },
): number => {
  const childNodes = nodes.filter((node) => edges.some((edge) => edge.source === MAIN_NODE_ID && edge.target === node.id));

  if (childNodes.length === 0) return MIN_NODE_SIZE;
  const product = childNodes.reduce((acc, node) => acc * (node.data.size ?? 96), 1);
  const proportionalSize = product / childNodes.length;
  return Math.max(MIN_NODE_SIZE, Math.min(MAX_NODE_SIZE, Math.round(proportionalSize)));
};

export { calculateMainNodeSize, createNode, getEdgeParams };
