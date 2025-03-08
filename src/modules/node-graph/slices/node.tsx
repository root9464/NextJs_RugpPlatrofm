import { memo, type ReactNode } from 'react';

import { Handle, Position, type NodeProps, type Node as XYNode } from '@xyflow/react';
import { IconCloud } from 'justd-icons';

export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
};

export const NodeComponent = memo(({ data }: NodeProps<XYNode<TurboNodeData>>) => {
  return (
    <>
      <div className='cloud gradient'>
        <div>
          <IconCloud />
        </div>
      </div>
      <div className='wrapper gradient'>
        <div className='inner'>
          <div className='body'>
            {data.icon && <div className='icon'>{data.icon}</div>}
            <div>
              <div className='title'>{data.title}</div>
              {data.subline && <div className='subline'>{data.subline}</div>}
            </div>
          </div>
          <Handle type='target' position={Position.Left} />
          <Handle type='source' position={Position.Right} />
        </div>
      </div>
    </>
  );
});
