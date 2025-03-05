'use client';
import { Timeline } from './components/timeline';

const dateMarkers = [new Date(2023, 2, 10), new Date(2023, 5, 15), new Date(2023, 8, 20), new Date(2023, 11, 30)];

const minDate = dateMarkers[0].getTime();
const maxDate = dateMarkers[dateMarkers.length - 1].getTime();

const dateMarkersPercentage = (date: Date): number => {
  const time = date.getTime();
  return ((time - minDate) / (maxDate - minDate)) * 100;
};

const formatMarker = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const TimeLineModule = () => {
  return <Timeline widthSize={1290} markers={dateMarkers} markerToPercentage={dateMarkersPercentage} formatMarker={formatMarker} />;
};
