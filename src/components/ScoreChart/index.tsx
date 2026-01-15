import React, { useMemo } from 'react';
import { CartesianMarkerProps } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import { getScore } from '../../helpers';

interface ScoreChartProps {
  currentTip: number;
  correctAnswer: number;
  previousTips?: number[];
}

const chartMargin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};

function uniqMarkers(markers: CartesianMarkerProps[]) {
  const seen = new Set<string>();
  const out: CartesianMarkerProps[] = [];

  for (const m of markers) {
    const key = `${m.axis}:${String(m.value)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(m);
  }
  return out;
}

const ScoreChart = ({
  currentTip,
  correctAnswer,
  previousTips = [],
}: ScoreChartProps) => {
  const score = getScore(currentTip, correctAnswer);
  const markers = useMemo<CartesianMarkerProps[]>(() => {
    const baseMarkers: CartesianMarkerProps[] = [
      {
        axis: 'x',
        value: Number(currentTip),
        lineStyle: {
          stroke: '#5CC8F9',
          strokeWidth: 2,
          transform: `translateY(calc(${(1 - score).toFixed(0)}% - ${(
            -score - 99
          ).toFixed(0)}px))
                    scaleY(${(score / 100).toFixed(2)})`,
        },
      },
      {
        axis: 'x',
        value: correctAnswer,
        lineStyle: { stroke: '#fff', strokeWidth: 2 },
      },
      {
        axis: 'y',
        value: score,
        legend: `+${score.toFixed(2)}`,
        textStyle: {
          fill: '#feff00',
          transform: `scale(2, 2) translate(50px, -10px)`,
        },
        lineStyle: {
          stroke: '#feff00',
          strokeWidth: 1,
          transform: `scaleX(${0.4 * (currentTip / correctAnswer)})`,
        },
      },
    ];

    const previousScore = previousTips.map((tip) =>
      getScore(tip, correctAnswer)
    );
    const previousTipsMarkers: CartesianMarkerProps[] = previousTips.map(
      (tip, index) => ({
        axis: 'x',
        value: Number(tip),
        lineStyle: {
          stroke: '#FF0070',
          strokeWidth: 1,
          transform:
            previousScore[index] > 0
              ? `translateY(calc(${(1 - previousScore[index]).toFixed(0)}% - ${(
                  -previousScore[index] - 99
                ).toFixed(0)}px))
                        scaleY(${(previousScore[index] / 100).toFixed(2)})`
              : `translateY(calc(${(100 * 1).toFixed(0)}% - ${(100 * 1).toFixed(
                  0
                )}px))
                    scaleY(0.1)`,
        },
      })
    );

    return uniqMarkers([...baseMarkers, ...previousTipsMarkers]);
  }, [currentTip, correctAnswer, previousTips, score]);

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
          y: 100,
        },
      ],
    },
    {
      id: 'lin',
      color: '#F7CE45',
      data: [
        {
          x: correctAnswer,
          y: 100,
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
        max: 100,
      }}
      xScale={{
        type: 'linear',
        min: 0,
        max: correctAnswer * 2.5,
      }}
      axisBottom={{
        tickValues: Array.from(new Set([currentTip, correctAnswer])),
      }}
      axisLeft={{
        tickValues: [0, 100],
        legend: 'score',
        legendPosition: 'middle',
        legendOffset: -15,
      }}
      data={data}
      margin={chartMargin}
      enableGridX={false}
      enableGridY={false}
      enablePoints={false}
      curve="monotoneX"
      markers={markers}
    />
  );
};

export { ScoreChart };
