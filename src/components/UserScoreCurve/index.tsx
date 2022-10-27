import React from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';

type StatsData = { x: number; y: number };
interface UserScoreCurveProps {
  stats: StatsData[];
}

const commonProperties = {
  maxHeight: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  pointSize: 8,
  pointColor: { theme: 'background' },
  pointBorderWidth: 2,
  pointBorderColor: { theme: 'background' },
};

const getTickRule = (days: number) => {
  if (days < 10) {
    return 'every 1 days';
  }

  if (days < 30) {
    return 'every 2 days';
  }

  if (days < 90) {
    return 'every 10 days';
  }

  return 'every 1 month';
};

const UserScoreCurve = ({ stats }: UserScoreCurveProps) => {
  const data = [
    {
      id: 'userScoreCurve',
      data: stats.map(({ x, y }: StatsData) => ({
        y,
        x: moment(x).format('YYYY-MM-DD'),
      })),
    },
  ];

  const daysBetween =
    (stats[stats.length - 1].x - stats[0].x) / (24 * 60 * 60 * 1000);

  return (
    <ResponsiveLine
      data={data}
      {...commonProperties}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%Y-%m-%d"
      axisBottom={{
        format: '%d.%m.%Y',
        tickValues: getTickRule(daysBetween),
        tickRotation: -37,
      }}
      curve="linear"
      theme={{
        grid: { line: { stroke: '#9A9A9A', strokeDasharray: '1 5' } },
      }}
    />
  );
};

export { UserScoreCurve };
