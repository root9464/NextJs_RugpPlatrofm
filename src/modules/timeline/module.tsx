'use client';
import { useWindow } from '@/shared/hooks/useWindow';
import { Timeline } from './components/timeline';

const dateMarkers = [new Date(2023, 2, 10), new Date(2023, 5, 15), new Date(2023, 8, 20), new Date(2023, 11, 30)];

const minDate = dateMarkers[0].getTime();
const maxDate = dateMarkers[dateMarkers.length - 1].getTime();

const dateMarkersPercentage = (date: Date): number => {
  const time = date.getTime();
  return ((time - minDate) / (maxDate - minDate)) * 100;
};

const formatMarker = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const widthSizeRanges = [
  { minWidth: 1600, widthSize: 1290 },
  { minWidth: 1400, widthSize: 1000 },
  { minWidth: 1200, widthSize: 930 },
  { minWidth: 992, widthSize: 600 },
  { minWidth: 768, widthSize: 400 },
  { minWidth: 0, widthSize: 300 },
];

function getWidthSize(minWidth: number) {
  const widthSizeRange = widthSizeRanges.find((range) => range.minWidth <= minWidth) ?? widthSizeRanges[widthSizeRanges.length - 1];
  return widthSizeRange.widthSize;
}

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

export const TimeLineModule = () => {
  const { width } = useWindow();

  const widthSize = getWidthSize(width);

  return <Timeline widthSize={widthSize} markers={histogramData} />;
};
