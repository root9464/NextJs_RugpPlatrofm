'use client';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useRef } from 'react';

const markers = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export const Timeline = () => {
  const containerRef = useRef(null);
  const width = useMotionValue(620);
  const leftX = useMotionValue(0);
  const rightX = useMotionValue(620);
  const highlightWidth = useTransform(() => rightX.get() - leftX.get());

  const markerPositions = markers.map((marker) => (marker / markers[markers.length - 1]) * width.get());
  const minDistance = markerPositions[1] - markerPositions[0];

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

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col p-4'>
      <motion.div ref={containerRef} className='relative h-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50' style={{ width }}>
        <div className='absolute inset-0'>
          {markerPositions.map((pos, index) => (
            <div key={markers[index]} className='absolute h-4 w-px bg-red-500' style={{ left: pos }}>
              <span className='absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-600'>{markers[index]}</span>
            </div>
          ))}
        </div>

        <motion.div className='absolute h-full w-full bg-purple-500/50' style={{ x: leftX, width: highlightWidth }} />

        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: width.get() }}
          dragElastic={0}
          onDragEnd={handleLeftDragEnd}
          style={{ x: leftX }}
          className='absolute top-0 z-10 h-full w-max cursor-col-resize'>
          <div className='absolute top-1/2 left-0 h-8 w-2 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>

        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: width.get() }}
          dragElastic={0}
          onDragEnd={handleRightDragEnd}
          style={{ x: rightX }}
          className='absolute top-0 z-10 h-full w-max cursor-col-resize'>
          <div className='absolute top-1/2 right-0 h-8 w-2 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>
      </motion.div>

      <div className='mt-2 flex justify-between text-sm text-gray-600'>
        <motion.span>{useTransform(leftX, (x) => `${Math.round((x / width.get()) * 100)}%`)}</motion.span>
        <motion.span>{useTransform(rightX, (x) => `${Math.round((x / width.get()) * 100)}%`)}</motion.span>
      </div>
    </div>
  );
};
