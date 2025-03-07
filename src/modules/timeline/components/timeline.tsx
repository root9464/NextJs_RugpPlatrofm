/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';

type TimelineProps = {
  widthSize: number;
  markers: unknown[];
  markerToPercentage?: (marker: any) => number;
  formatMarker?: (marker: any) => string;
  offset?: number;
};

const histogramData = [
  { name: 'May', value: 150 },
  { name: 'May', value: 210 },
  { name: 'May', value: 320 },
  { name: 'May', value: 180 },
  { name: 'May', value: 260 },
  { name: 'Jun.', value: 90 },
  { name: 'Jun.', value: 140 },
  { name: 'Jun.', value: 200 },
  { name: 'Jun.', value: 170 },
  { name: 'Jun.', value: 230 },
  { name: 'Jul.', value: 120 },
  { name: 'Jul.', value: 180 },
  { name: 'Jul.', value: 250 },
  { name: 'Jul.', value: 300 },
  { name: 'Jul.', value: 210 },
  { name: 'Aug.', value: 200 },
  { name: 'Aug.', value: 270 },
  { name: 'Aug.', value: 350 },
  { name: 'Aug.', value: 290 },
  { name: 'Aug.', value: 310 },
  { name: 'Sep.', value: 330 },
  { name: 'Sep.', value: 410 },
  { name: 'Sep.', value: 380 },
  { name: 'Sep.', value: 460 },
  { name: 'Sep.', value: 390 },
  { name: 'Oct.', value: 250 },
  { name: 'Oct.', value: 320 },
  { name: 'Oct.', value: 280 },
  { name: 'Oct.', value: 360 },
  { name: 'Oct.', value: 310 },
  { name: 'Nov.', value: 290 },
  { name: 'Nov.', value: 350 },
  { name: 'Nov.', value: 400 },
  { name: 'Nov.', value: 380 },
  { name: 'Nov.', value: 420 },
  { name: 'Dec.', value: 190 },
  { name: 'Dec.', value: 240 },
  { name: 'Dec.', value: 300 },
  { name: 'Dec.', value: 270 },
  { name: 'Dec.', value: 330 },
];

export const Timeline = ({ widthSize, markers, markerToPercentage, formatMarker, offset }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useMotionValue(widthSize);
  const thisOffset = offset ?? 0;
  const effectiveWidth = width.get() - 2 * thisOffset;

  const defaultMarkerToPercentage = (marker: unknown): number => {
    if (typeof marker === 'number') return marker;
    if (marker instanceof Date) {
      const dates = markers as Date[];
      const times = dates.map((d) => d.getTime());
      const [min, max] = [Math.min(...times), Math.max(...times)];
      return ((Number(marker) - min) / (max - min)) * 100;
    }
    if (typeof marker === 'string') {
      const num = parseFloat(marker);
      if (!isNaN(num)) return num;
      return (markers.indexOf(marker) / (markers.length - 1)) * 100;
    }
    throw new Error('Please provide markerToPercentage for custom marker types');
  };

  const defaultFormatMarker = (marker: unknown): string => {
    if (typeof marker === 'number') return `${marker}%`;
    if (marker instanceof Date) return marker.toLocaleDateString();
    if (typeof marker === 'string') return marker;
    throw new Error('Please provide formatMarker for custom marker types');
  };

  const effectiveMarkerToPercentage = markerToPercentage ?? defaultMarkerToPercentage;
  const effectiveFormatMarker = formatMarker ?? defaultFormatMarker;

  const markerData = markers
    .map((marker) => ({
      marker,
      position: thisOffset + (effectiveMarkerToPercentage(marker) / 100) * effectiveWidth,
    }))
    .sort((a, b) => a.position - b.position);

  const leftX = useMotionValue(markerData[0]?.position ?? 0);
  const rightX = useMotionValue(markerData[markerData.length - 1]?.position ?? 0);
  const highlightWidth = useTransform(() => rightX.get() - leftX.get());

  const snap = (x: number, isLeft: boolean, otherX: number) => {
    const minDistance = markerData.length > 1 ? markerData[1].position - markerData[0].position : 0;
    const possiblePositions = isLeft
      ? markerData.filter((data) => data.position <= otherX - minDistance).map((data) => data.position)
      : markerData.filter((data) => data.position >= otherX + minDistance).map((data) => data.position);

    return possiblePositions.reduce(
      (p, c) => (Math.abs(c - x) < Math.abs(p - x) ? c : p),
      isLeft ? (markerData[0]?.position ?? 0) : (markerData[markerData.length - 1]?.position ?? 0),
    );
  };

  const handleLeftDragEnd = () => animate(leftX, snap(leftX.get(), true, rightX.get()), { duration: 0.2 });
  const handleRightDragEnd = () => animate(rightX, snap(rightX.get(), false, leftX.get()), { duration: 0.2 });

  const percentageTransform = (x: number) => `${Math.round(((x - thisOffset) / effectiveWidth) * 100)}%`;
  const leftPercentage = useTransform(leftX, percentageTransform);
  const rightPercentage = useTransform(rightX, percentageTransform);

  return (
    <div className='flex w-full flex-col'>
      <motion.div
        ref={containerRef}
        className='bg-uiPrimaryBg border-uiMutedPrimary relative h-16 overflow-hidden rounded-lg border'
        style={{ width }}>
        <div className='absolute inset-0'>
          {markerData.map((data, index) => (
            <div key={index} className='bg-uiMutedPrimary absolute top-1/2 h-4 w-px -translate-y-1/2' style={{ left: data.position }}>
              <span className='absolute -top-6 left-1/2 w-10 -translate-x-1/2 text-xs text-gray-600'>{effectiveFormatMarker(data.marker)}</span>
            </div>
          ))}
        </div>

        <motion.div className='bg-chart-1/20 absolute h-full w-full' style={{ x: leftX, width: highlightWidth }} />
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={histogramData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey='value' fill='var(--color-chart-1)' barSize={5} />
          </BarChart>
        </ResponsiveContainer>

        <motion.div
          drag='x'
          dragConstraints={{ left: thisOffset, right: thisOffset + effectiveWidth }}
          dragElastic={0}
          onDragEnd={handleLeftDragEnd}
          style={{ x: leftX }}
          className='absolute top-0 z-10 h-full w-max cursor-col-resize'>
          <div className='absolute top-1/2 left-0 h-8 w-2 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>

        <motion.div
          drag='x'
          dragConstraints={{ left: thisOffset, right: thisOffset + effectiveWidth }}
          dragElastic={0}
          onDragEnd={handleRightDragEnd}
          style={{ x: rightX }}
          className='absolute top-0 z-10 h-full w-max cursor-col-resize'>
          <div className='absolute top-1/2 right-0 h-8 w-2 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>
      </motion.div>

      <div className='mt-2 flex justify-between text-sm text-gray-600'>
        <motion.span>{leftPercentage}</motion.span>
        <motion.span>{rightPercentage}</motion.span>
      </div>
    </div>
  );
};
