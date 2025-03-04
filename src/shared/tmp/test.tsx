'use client';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useRef } from 'react';

const markers = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const minDistance = 20;

export const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useMotionValue(620);
  const leftX = useMotionValue(0);
  const rightX = useMotionValue(620);
  const highlightWidth = useTransform(() => rightX.get() - leftX.get());

  const snap = (x: number) => {
    const w = width.get();
    const percent = (x / w) * 100;
    const closest = markers.reduce((p, c) => (Math.abs(c - percent) < Math.abs(p - percent) ? c : p));
    return (closest / 100) * w;
  };

  const handleLeftDragEnd = () => {
    const snapped = snap(leftX.get());
    const max = snap(rightX.get()) - minDistance;
    animate(leftX, Math.min(snapped, max), { duration: 0.2 });
  };

  const handleRightDragEnd = () => {
    const snapped = snap(rightX.get());
    const min = snap(leftX.get()) + minDistance;
    animate(rightX, Math.max(snapped, min), { duration: 0.2 });
  };

  return (
    <div className='mx-auto w-full max-w-2xl p-4'>
      <motion.div ref={containerRef} className='relative h-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50'>
        <div className='absolute inset-0 flex items-center justify-between px-2'>
          {markers.map((marker) => (
            <div key={marker} className='relative h-4 w-px bg-red-500'>
              <span className='absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-600'>{marker}</span>
            </div>
          ))}
        </div>

        <motion.div className='absolute h-full bg-blue-100/50' style={{ x: leftX, width: highlightWidth }} />

        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: width.get() }}
          dragElastic={0}
          onDragEnd={handleLeftDragEnd}
          style={{ x: leftX }}
          className='absolute top-0 z-10 h-full w-2 cursor-col-resize'>
          <div className='absolute top-1/2 left-0 h-8 w-6 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>

        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: width.get() }}
          dragElastic={0}
          onDragEnd={handleRightDragEnd}
          style={{ x: rightX }}
          className='absolute top-0 z-10 h-full w-2 cursor-col-resize'>
          <div className='absolute top-1/2 right-0 h-8 w-6 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>
      </motion.div>

      <div className='mt-2 flex justify-between text-sm text-gray-600'>
        <motion.span>{useTransform(leftX, (x) => `${Math.round((x / width.get()) * 100)}%`)}</motion.span>
        <motion.span>{useTransform(rightX, (x) => `${Math.round((x / width.get()) * 100)}%`)}</motion.span>
      </div>
    </div>
  );
};
