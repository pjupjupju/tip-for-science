import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { getScore } from '../../helpers';

interface ScoreChartProps {
  currentTip: number;
  correctAnswer: number;
}

const ScoreChart = ({ currentTip, correctAnswer }: ScoreChartProps) => {
  const data = [
    {
      id: 'exp',
      color: '#F7CE46',
      data: [
        {
          x: 0.5 * correctAnswer,
          y: 0,
        },
        {
          x: 0.625 * correctAnswer,
          y: getScore(0.625 * correctAnswer, correctAnswer),
        },
        {
          x: 0.75 * correctAnswer,
          y: getScore(0.75 * correctAnswer, correctAnswer),
        },
        {
          x: 0.875 * correctAnswer,
          y: getScore(0.875 * correctAnswer, correctAnswer),
        },
        {
          x: correctAnswer,
          y: 1,
        },
      ],
    },
    {
      id: 'lin',
      color: '#F7CE45',
      data: [
        {
          x: correctAnswer,
          y: 1,
        },
        {
          x: 2 * correctAnswer,
          y: 0,
        },
      ],
    },
  ];
  return (
    <ResponsiveLine
      enableArea={true}
      colors={{ datum: 'color' }}
      yScale={{
        type: 'linear',
        min: 0,
        max: 1,
      }}
      xScale={{
        type: 'linear',
        min: 0,
        max: correctAnswer * 2.5,
      }}
      axisBottom={{
        tickValues: [currentTip, correctAnswer],
      }}
      axisLeft={{
        tickValues: [0, 1],
        legend: 'score',
        legendPosition: 'middle',
        legendOffset: -15,
      }}
      data={data}
      margin={{
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      }}
      enableGridX={false}
      enableGridY={false}
      enablePoints={false}
      curve="monotoneX"
      markers={[
        {
          axis: 'x',
          value: Number(currentTip),
          lineStyle: {
            stroke: '#5CC8F9',
            strokeWidth: 1,
            transform: `
                      translateY(${(
                        50 *
                        (1 - getScore(currentTip, correctAnswer))
                      ).toFixed(0)}%)
                      scaleY(${getScore(currentTip, correctAnswer).toFixed(
                        2
                      )})`,
          },
        },
        {
          axis: 'x',
          value: correctAnswer,
          lineStyle: { stroke: '#fff', strokeWidth: 1 },
        },
      ]}
    />
  );
};

export { ScoreChart };
