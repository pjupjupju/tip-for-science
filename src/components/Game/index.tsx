import React, { KeyboardEvent, useRef } from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { ResponsiveLine } from '@nivo/line';
import { Label, Input } from '@rebass/forms';
import { Link } from 'react-router-dom';
import { TooCloseDialog } from './TooCloseDialog';
import { GameOverScreen } from './GameOverScreen';
import { PreviousTips } from './PreviousTips';
import { getScore } from '../../helpers';
import { Container } from '../Container';
import { SubmitButton } from '../SubmitButton';

export interface Settings {
  question: string;
  image: string;
  previousTips?: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
}

interface GameProps {
  isSubmitted: boolean;
  onFinish: Function;
  onHome: Function;
  onSubmit?: (tip: number) => void;
  settings: Settings;
  currentTip?: number;
  score: number;
}

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
  flex: 1,
  mx: 3,
};

const imageStyle = {
  height: '210px',
  width: '100%',
  alignSelf: 'center',
};

const labelStyle = {
  flexGrow: 0,
  flexShrink: 0,
  width: 'auto',
  color: 'white',
};

const isTooClose = (currentTip: number, correctAnswer: number): boolean =>
  currentTip >= correctAnswer * 0.95 && currentTip <= correctAnswer * 1.05;

const Game = ({
  settings: { question, image, previousTips, unit, timeLimit, correctAnswer },
  isSubmitted,
  onHome,
  onSubmit,
  onFinish,
  currentTip,
  score,
}: GameProps) => {
  const mockData = [
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

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickFinish = () => {
    onFinish();
  };
  const handleClickHome = () => {
    onHome();
  };

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSubmit) {
      onSubmit(Number(event.currentTarget.value));
    }
  };

  const handleClickSubmit = () => {
    if (inputRef.current && onSubmit) {
      onSubmit(Number(inputRef.current.value));
    }
  };

  return !isSubmitted ? (
    <Container>
      <Box height="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          {question}
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <PreviousTips previousTips={previousTips} unit={unit} />
      <Flex justifyContent="center" alignItems="center" p={2}>
        <Label htmlFor="tip" sx={labelStyle}>
          tip:
        </Label>
        <Input
          ref={inputRef}
          id="tip"
          name="tip"
          type="number"
          placeholder="váš tip"
          sx={inputStyles}
          onKeyDown={handleSubmit}
        />
        <Text color="white">{unit}</Text>
      </Flex>{' '}
      <Flex py={2} justifyContent="flex-end">
        <SubmitButton onClick={handleClickSubmit} timeLimit={timeLimit} />
      </Flex>
    </Container>
  ) : (
    <Container>
      <Box height="80px">
        <Text
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          p={3}
        >
          Score:{' '}
          {typeof currentTip != 'undefined'
            ? getScore(currentTip, correctAnswer).toFixed(3)
            : 0}
        </Text>
      </Box>
      <Image src={image} sx={imageStyle} />
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        {typeof currentTip !== 'undefined' ? (
          <>
            <Box width="100%" height="200px">
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
                axisLeft={{ tickValues: [0, 1], legend: "score", legendPosition: 'middle', legendOffset: -15 }}
                data={mockData}
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
            </Box>
            {isTooClose(currentTip, correctAnswer) && (
              <TooCloseDialog
                onGuessed={() => {
                  console.log('som frajer a som tipnul');
                }}
                onKnewIt={() => {
                  console.log('som frajer a som vedel');
                }}
              />
            )}
          </>
        ) : (
          <GameOverScreen />
        )}
      </Flex>
      <Flex justifyContent="space-between" mt="auto">
        <Button as={Link} onClick={handleClickHome}>
          Domů
        </Button>
        <Button as={Link} onClick={handleClickFinish}>
          Pokračovat
        </Button>
      </Flex>
    </Container>
  );
};

export { Game, GameOverScreen, TooCloseDialog, PreviousTips };
