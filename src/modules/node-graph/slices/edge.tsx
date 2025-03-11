import { useInternalNode, type EdgeProps } from '@xyflow/react';
import { getEdgeParams } from '../utils/utils';

export const EdgeComponent = ({ id, source, target, style = {}, markerEnd }: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const edgePath = `M ${sx},${sy} L ${tx},${ty}`;

  return <path id={id} style={style} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} stroke='url(#edge-gradient)' />;
};
