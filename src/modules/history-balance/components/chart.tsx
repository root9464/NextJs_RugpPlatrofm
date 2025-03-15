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

export const BalanceChart = ({ data }: { data: { time: string; value: number }[] }) => {
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

    newSeries.setData(data ?? []); //*!

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [chartContainerRef]);

  return <div ref={chartContainerRef} className='h-full w-full' />;
};
