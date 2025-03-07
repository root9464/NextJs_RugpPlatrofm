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
  const sortedRanges = [...widthSizeRanges].sort((a, b) => b.minWidth - a.minWidth);
  for (let i = 0; i < sortedRanges.length - 1; i++) {
    const upper = sortedRanges[i];
    const lower = sortedRanges[i + 1];

    if (minWidth <= upper.minWidth && minWidth > lower.minWidth) {
      const ratio = (minWidth - lower.minWidth) / (upper.minWidth - lower.minWidth);
      return Math.round(lower.widthSize + ratio * (upper.widthSize - lower.widthSize));
    }
  }

  if (minWidth > sortedRanges[0].minWidth) {
    return sortedRanges[0].widthSize;
  }
  return sortedRanges[sortedRanges.length - 1].widthSize;
}

export const TimeLineModule = () => {
  const { width } = useWindow();

  const widthSize = getWidthSize(width);

  return <Timeline widthSize={widthSize} markers={dateMarkers} markerToPercentage={dateMarkersPercentage} formatMarker={formatMarker} />;
};
