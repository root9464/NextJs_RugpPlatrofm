'use client';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useRef } from 'react';

const markers = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const offset = 16;

export const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useMotionValue(620);
  const effectiveWidth = width.get() - 2 * offset;
  const markerPositions = markers.map((marker) => offset + (marker / 100) * effectiveWidth);
  const minDistance = markerPositions[1] - markerPositions[0];

  const leftX = useMotionValue(offset);
  const rightX = useMotionValue(offset + effectiveWidth);
  const highlightWidth = useTransform(() => rightX.get() - leftX.get());

  const snap = (x: number, isLeft: boolean, otherX: number) => {
    const possibleMarkers = isLeft
      ? markerPositions.filter((m) => m <= otherX - minDistance)
      : markerPositions.filter((m) => m >= otherX + minDistance);
    if (possibleMarkers.length === 0) return isLeft ? markerPositions[0] : markerPositions[markerPositions.length - 1];
    return possibleMarkers.reduce((p, c) => (Math.abs(c - x) < Math.abs(p - x) ? c : p));
  };

  const handleLeftDragEnd = () => {
    const snapped = snap(leftX.get(), true, rightX.get());
    animate(leftX, snapped, { duration: 0.2 });
  };

  const handleRightDragEnd = () => {
    const snapped = snap(rightX.get(), false, leftX.get());
    animate(rightX, snapped, { duration: 0.2 });
  };

  const percentageTransform = (x: number) => `${Math.round(((x - offset) / effectiveWidth) * 100)}%`;

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col' style={{ padding: offset }}>
      <motion.div ref={containerRef} className='relative h-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50' style={{ width }}>
        <div className='absolute inset-0'>
          {markerPositions.map((pos, index) => (
            <div key={markers[index]} className='absolute top-1/2 h-4 w-px -translate-y-1/2 bg-red-500' style={{ left: pos }}>
              <span className='absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-600'>{markers[index]}</span>
            </div>
          ))}
        </div>

        <motion.div className='absolute h-full w-full bg-purple-500/50' style={{ x: leftX, width: highlightWidth }} />

        <motion.div
          drag='x'
          dragConstraints={{ left: offset, right: offset + effectiveWidth }}
          dragElastic={0}
          onDragEnd={handleLeftDragEnd}
          style={{ x: leftX }}
          className='absolute top-0 z-10 h-full w-max cursor-col-resize'>
          <div className='absolute top-1/2 left-0 h-8 w-2 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>

        <motion.div
          drag='x'
          dragConstraints={{ left: offset, right: offset + effectiveWidth }}
          dragElastic={0}
          onDragEnd={handleRightDragEnd}
          style={{ x: rightX }}
          className='absolute top-0 z-10 h-full w-max cursor-col-resize'>
          <div className='absolute top-1/2 right-0 h-8 w-2 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>
      </motion.div>

      <div className='mt-2 flex justify-between text-sm text-gray-600'>
        <motion.span>{useTransform(leftX, percentageTransform)}</motion.span>
        <motion.span>{useTransform(rightX, percentageTransform)}</motion.span>
      </div>
    </div>
  );
};
