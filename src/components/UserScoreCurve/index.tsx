import React from 'react';
import { Line } from '@nivo/line';

const UserScoreCurve = () => {
  const data = [
    {
      id: 'userScoreCurve',
      data: [
        { x: '2021-01-01', y: 1.5 },
        { x: '2021-01-02', y: 4 },
        { x: '2021-01-03', y: 5 },
        { x: '2021-01-04', y: 12 },
        { x: '2021-01-05', y: 14 },
        { x: '2021-01-06', y: 16 },
        { x: '2021-01-07', y: 16 },
        { x: '2021-01-08', y: 18 },
      ],
    },
  ];

  const commonProperties = {
    width: 900,
    height: 400,
    margin: { top: 20, right: 20, bottom: 60, left: 80 },
    data,
    pointSize: 8,
    pointColor: { theme: 'background' },
    pointBorderWidth: 2,
    pointBorderColor: { theme: 'background' },
  };

  return (
    <Line
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
