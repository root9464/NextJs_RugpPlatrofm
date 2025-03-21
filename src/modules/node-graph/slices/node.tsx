import { Handle, Position, type NodeProps, type Node as XYNode } from '@xyflow/react';
import { memo, type ReactNode } from 'react';

export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
  size?: number;
};

export const NodeComponent = memo(({ data, selected }: NodeProps<XYNode<TurboNodeData>>) => {
  const size = data.size ?? 96;
  return (
    <>
      <div
        style={{ width: size, height: size }}
        className={`relative overflow-hidden rounded-full p-0.5 before:absolute before:top-1/2 before:left-1/2 before:w-[141.421356237%] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:pb-[141.421356237%] before:content-[""] ${
          selected
            ? 'before:animate-[spin_4s_linear_infinite_reverse] before:bg-[conic-gradient(from_-160deg_at_50%_50%,#e92a67_0deg,#a853ba_120deg,#2a8af6_240deg,rgba(42,138,246,0)_360deg)]'
            : 'before:bg-[conic-gradient(from_-160deg_at_50%_50%,#e92a67_0deg,#a853ba_120deg,#2a8af6_240deg,#e92a67_360deg)]'
        }`}>
        <div className='relative flex h-full w-full items-center justify-center rounded-full bg-[rgb(17,17,17)] p-2'>
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
            <div className='text-base leading-none'>{data.title}</div>
            {data.subline && <div className='mt-1 text-xs text-[#777]'>{data.subline}</div>}
          </div>
          <Handle type='target' position={Position.Left} />
          <Handle type='source' position={Position.Right} />
        </div>
      </div>
    </>
  );
});
