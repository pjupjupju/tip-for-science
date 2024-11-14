import React from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';
import { getColor } from '../../theme';

type StatsData = { x: number; y: number };
interface UserScoreCurveProps {
  stats: StatsData[];
}

const commonProperties = {
  colors: { datum: 'color' },
  maxHeight: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  pointSize: 8,
  pointColor: { theme: 'background' },
  pointBorderWidth: 2,
  pointBorderColor: { theme: 'background' },
};

const UserScoreCurve = ({ stats }: UserScoreCurveProps) => {
  const data = [
    {
      id: 'userScoreCurve',
      color: getColor('accent'),
      data: stats.map(({ x, y }: StatsData) => ({
        y,
        x: moment(x).format('YYYY-MM-DD HH:mm:ss'),
      })),
    },
  ];

  // console.log('data: ', data);

  return (
    <ResponsiveLine
      data={data}
      {...commonProperties}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d %H:%M:%S',
        useUTC: false,
        precision: 'minute',
      }}
      xFormat="time:%Y-%m-%d %H:%M:%S"
      axisBottom={{
        format: '%d.%m.%Y',
        tickValues: 6,
        tickRotation: -37,
      }}
      curve="basis"
      theme={{
        grid: { line: { stroke: '#2A2A2A', strokeDasharray: '1 2' } },
      }}
    />
  );
};

export { UserScoreCurve };
