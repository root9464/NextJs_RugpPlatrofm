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

export const TimeLineModule = () => {
  const { width } = useWindow();

  const widthSize = getWidthSize(width);

  return <Timeline widthSize={widthSize} markers={dateMarkers} markerToPercentage={dateMarkersPercentage} formatMarker={formatMarker} />;
};
