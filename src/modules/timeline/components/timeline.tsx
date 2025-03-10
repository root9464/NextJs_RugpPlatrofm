/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';

type DefaultObject = {
  year: string;
  month: string;
  records: Array<{ date: string; value: number }>;
};

type TimelineProps = {
  widthSize: number;
  markers: DefaultObject[];
  markerToPercentage?: (marker: DefaultObject) => number;
  formatMarker?: (marker: DefaultObject) => string;
  offset?: number;
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const markerToDate = (marker: DefaultObject): Date => {
  const monthIndex = monthNames.indexOf(marker.month);
  if (monthIndex === -1) {
    throw new Error(`Invalid month: ${marker.month}`);
  }
  return new Date(parseInt(marker.year), monthIndex);
};

const defaultFormatMarker = (marker: DefaultObject): string => {
  return `${marker.month} ${marker.year}`;
};

export const Timeline = ({ widthSize, markers, markerToPercentage, formatMarker, offset }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useMotionValue(widthSize);
  const thisOffset = offset ?? 0;
  const effectiveWidth = width.get() - 2 * thisOffset;

  const defaultMarkerToPercentage = (marker: DefaultObject): number => {
    if (markers.length === 0) return 0;
    const dates = markers.map(markerToDate);
    const times = dates.map((d) => d.getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    if (minTime === maxTime) return 50;
    const markerTime = markerToDate(marker).getTime();
    return ((markerTime - minTime) / (maxTime - minTime)) * 100;
  };

  const effectiveMarkerToPercentage = markerToPercentage ?? defaultMarkerToPercentage;
  const effectiveFormatMarker = formatMarker ?? defaultFormatMarker;

  const markerData = markers
    .map((marker) => ({
      marker,
      position: thisOffset + (effectiveMarkerToPercentage(marker) / 100) * effectiveWidth,
      positionPercentage: effectiveMarkerToPercentage(marker) / 100,
    }))
    .sort((a, b) => a.position - b.position);

  const barData = markers
    .flatMap((marker, index) => {
      if (index === markers.length - 1) return [];
      const numBars = marker.records.length;
      const startPosition = markerData[index].position;
      const endPosition = markerData[index + 1].position;
      const barWidth = (endPosition - startPosition) / numBars;

      return marker.records.map((record, recordIndex) => ({
        position: startPosition + recordIndex * barWidth + barWidth / 2,
        positionPercentage: (startPosition + recordIndex * barWidth + barWidth / 2 - thisOffset) / effectiveWidth,
        value: record.value,
      }));
    })
    .sort((a, b) => a.position - b.position);

  const leftX = useMotionValue(barData[0]?.position ?? 0);
  const rightX = useMotionValue(barData[barData.length - 1]?.position ?? 0);
  const highlightWidth = useTransform(() => rightX.get() - leftX.get());

  const snap = (x: number, isLeft: boolean, otherX: number) => {
    const minDistance = barData.length > 1 ? barData[1].position - barData[0].position : 0;
    const possiblePositions = isLeft
      ? barData.filter((data) => data.position <= otherX - minDistance).map((data) => data.position)
      : barData.filter((data) => data.position >= otherX + minDistance).map((data) => data.position);

    return possiblePositions.reduce(
      (p, c) => (Math.abs(c - x) < Math.abs(p - x) ? c : p),
      isLeft ? (barData[0]?.position ?? 0) : (barData[barData.length - 1]?.position ?? 0),
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

        <div style={{ left: thisOffset, width: effectiveWidth, height: '100%' }} className='absolute inset-0'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={barData} barCategoryGap={0} barGap={0}>
              <XAxis dataKey='positionPercentage' type='number' domain={[0, 1]} hide />
              <Bar dataKey='value' fill='var(--color-chart-1)' barSize={5} shape={CustomBarShape as any} />
            </BarChart>
          </ResponsiveContainer>
        </div>

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

type CustomBarProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CustomBarShape = ({ x, y, width, height }: CustomBarProps) => {
  return <rect x={x - 2.5} y={y + height / 2} width={width} height={height / 2} fill='var(--color-chart-1)' />;
};
