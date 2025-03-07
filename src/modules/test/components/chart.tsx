'use client';

import {
  AreaSeries,
  AreaStyleOptions,
  ChartOptions,
  ColorType,
  createChart,
  CrosshairMode,
  DeepPartial,
  LineStyle,
  LineType,
  SeriesOptionsCommon,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

const chartAreaStyle: DeepPartial<ChartOptions> = {
  layout: {
    background: { type: ColorType.Solid, color: '#090c14' },
    textColor: '#414a60',
    attributionLogo: false,
  },
  grid: {
    vertLines: { color: 'transparent' },
    horzLines: { color: '#121B2E' },
  },
  crosshair: {
    horzLine: { color: 'white', style: LineStyle.Dashed },
    vertLine: { color: 'white', style: LineStyle.Dashed },
    mode: CrosshairMode.Magnet,
  },
};

const chartAreaSeriesStyle: DeepPartial<AreaStyleOptions & SeriesOptionsCommon> = {
  lineColor: 'rgba(21,93,252,0.95)',
  topColor: 'rgba(21,93,252,0.95)',
  bottomColor: 'rgba(21, 93, 252, 0.05)',
  priceLineColor: 'rgba(21,93,252,0.5)',
  priceLineStyle: LineStyle.Dotted,
  lineType: LineType.Curved,
};

const initialData = [
  { time: '2018-12-22', value: 32.51 },
  { time: '2018-12-23', value: 31.11 },
  { time: '2018-12-24', value: 27.02 },
  { time: '2018-12-25', value: 27.32 },
  { time: '2018-12-26', value: 25.17 },
  { time: '2018-12-27', value: 28.89 },
  { time: '2018-12-28', value: 25.46 },
  { time: '2018-12-29', value: 23.92 },
  { time: '2018-12-30', value: 22.68 },
  { time: '2018-12-31', value: 22.67 },
];

export const Chart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current as HTMLDivElement, {
      ...chartAreaStyle,
      width: chartContainerRef.current?.clientWidth,
      height: 300,
    });

    chart.timeScale().fitContent();
    const newSeries = chart.addSeries(AreaSeries, chartAreaSeriesStyle);

    newSeries.setData(initialData);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [chartContainerRef]);

  return <div ref={chartContainerRef} className='h-full w-full' />;
};
