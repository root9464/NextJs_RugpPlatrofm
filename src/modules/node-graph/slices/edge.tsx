import { getBezierPath, useInternalNode, type EdgeProps } from '@xyflow/react';
import { getEdgeParams } from '../utils/utils';

export const EdgeComponent = ({ id, source, target, style = {}, markerEnd }: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
  });

  return <path id={id} style={style} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} stroke='url(#edge-gradient)' />;
};
