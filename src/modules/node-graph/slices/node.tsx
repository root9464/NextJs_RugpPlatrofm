import { Handle, Position, type NodeProps, type Node as XYNode } from '@xyflow/react';
import { IconCloud } from 'justd-icons';
import { memo, type ReactNode } from 'react';

export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
};

export const NodeComponent = memo(({ data, selected }: NodeProps<XYNode<TurboNodeData>>) => {
  return (
    <>
      <div className='absolute top-0 right-0 z-[1] flex h-[30px] w-[30px] translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full p-0.5 shadow-[10px_0_15px_rgba(42,138,246,0.3),-10px_0_15px_rgba(233,42,103,0.3)] before:absolute before:top-1/2 before:left-1/2 before:w-[141.421356237%] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-[conic-gradient(from_-160deg_at_50%_50%,#e92a67_0deg,#a853ba_120deg,#2a8af6_240deg,#e92a67_360deg)] before:pb-[141.421356237%] before:content-[""]'>
        <div className='relative flex flex-grow items-center justify-center rounded-full bg-[rgb(17,17,17)]'>
          <IconCloud />
        </div>
      </div>
      <div
        className={`relative flex flex-grow overflow-hidden rounded-[10px] p-0.5 before:absolute before:top-1/2 before:left-1/2 before:w-[141.421356237%] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:pb-[141.421356237%] before:content-[""] ${selected ? 'before:animate-[spin_4s_linear_infinite_reverse] before:bg-[conic-gradient(from_-160deg_at_50%_50%,#e92a67_0deg,#a853ba_120deg,#2a8af6_240deg,rgba(42,138,246,0)_360deg)]' : 'before:bg-[conic-gradient(from_-160deg_at_50%_50%,#e92a67_0deg,#a853ba_120deg,#2a8af6_240deg,#e92a67_360deg)]'}`}>
        <div className='relative flex flex-grow flex-col justify-center rounded-[10px] bg-[rgb(17,17,17)] p-4 px-5'>
          <div className='flex flex-col'>
            <div className='mb-0.5 text-base leading-none'>{data.title}</div>
            {data.subline && <div className='text-xs text-[#777]'>{data.subline}</div>}
          </div>
          <Handle type='target' position={Position.Left} />
          <Handle type='source' position={Position.Right} />
        </div>
      </div>
    </>
  );
});
